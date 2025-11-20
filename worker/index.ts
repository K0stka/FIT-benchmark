import { BenchmarkQueueJobs, BenchmarkResults, BenchmarkStepResults, TestCaseResults, db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { getFilePath } from "@/lib/storage";
import { exec } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { copyFile, writeFile, mkdir, rm } from "fs/promises";
import { tmpdir } from "os";

const execAsync = promisify(exec);

async function ensureRunnerImage() {
	try {
		console.log("Checking for benchmark-runner image...");
		await execAsync("docker inspect benchmark-runner:latest");
		console.log("benchmark-runner image found.");
	} catch (e) {
		console.log("benchmark-runner image not found. Building...");
		// We assume we are in /app and worker/Dockerfile is at worker/Dockerfile
		// If running locally (not in docker), paths might differ, but let's assume standard structure
		await execAsync("docker build -t benchmark-runner:latest -f worker/Dockerfile .");
		console.log("benchmark-runner image built.");
	}
}

async function processJob(job: any) {
	console.log(`Starting job ${job.id}`);

	const workDir = join(tmpdir(), `benchmark-job-${job.id}`);
	await mkdir(workDir, { recursive: true });

	try {
		// 1. Prepare files
		const sourcePath = await getFilePath(job.submittedFileId);
		// Copy source file to workDir/main.c
		await copyFile(sourcePath, join(workDir, "main.c"));

		// Copy benchmark step assets
		for (const step of job.benchmark.benchmarkSteps) {
			if (step.assets) {
				for (const asset of step.assets) {
					const assetPath = await getFilePath(asset.fileId);
					await copyFile(assetPath, join(workDir, asset.filename));
				}
			}
		}

		// 2. Run Benchmark Steps
		let allStepsPassed = true;
		const stepResults: {
			benchmarkStepId: number;
			status: "completed" | "wrong_answer" | "timed_out" | "error";
			executionTimeMilliseconds: number;
		}[] = [];

		for (const step of job.benchmark.benchmarkSteps) {
			console.log(`Running step: ${step.name}`);

			const command = step.commandTemplate.replace("{{file}}", "main.c");
			// Use a docker container to run the command
			// We assume the image 'benchmark-runner:latest' is available
			const dockerCmd = `docker run --rm -v "${workDir}:/app" -w /app benchmark-runner:latest /bin/sh -c "${command}"`;

			const startTime = Date.now();
			let status: "completed" | "wrong_answer" | "timed_out" | "error" = "completed";
			try {
				await execAsync(dockerCmd, { timeout: step.timeoutSeconds * 1000 });
			} catch (e: any) {
				console.error(`Step ${step.name} failed:`, e);
				status = e.killed ? "timed_out" : "error";
				allStepsPassed = false;
			}
			const duration = Date.now() - startTime;

			stepResults.push({
				benchmarkStepId: step.id,
				status,
				executionTimeMilliseconds: duration,
			});

			if (!allStepsPassed) break;
		}

		// 3. Run Test Cases (if steps passed)
		const testCaseResults: {
			testCaseId: number;
			status: "passed" | "failed" | "timed_out" | "error" | "memory_error";
			executionTimeMilliseconds: number;
			memoryUsageBytes?: number;
		}[] = [];
		let totalScore = 0;
		let testCaseStatus = "all_passed";

		if (allStepsPassed) {
			for (const tc of job.benchmark.testCases) {
				console.log(`Running test case: ${tc.name}`);

				// Copy test case assets
				if (tc.assets) {
					for (const asset of tc.assets) {
						const assetPath = await getFilePath(asset.fileId);
						await copyFile(assetPath, join(workDir, asset.filename));
					}
				}

				// Prepare input file
				const inputFilePath = join(workDir, "input.in");
				await writeFile(inputFilePath, tc.input || "");

				const command = tc.testCommandTemplate.replace("{{file}}", "main.c");

				// Phase 1: Normal Execution (Performance & Correctness)
				const runCmd = `docker run --rm -i -v "${workDir}:/app" -w /app benchmark-runner:latest /bin/sh -c "${command} < input.in"`;

				const startTime = Date.now();
				let status: "passed" | "failed" | "timed_out" | "error" | "memory_error" = "passed";
				let stdout = "";

				try {
					const result = await execAsync(runCmd, { timeout: tc.timeoutSeconds * 1000 });
					stdout = result.stdout;
				} catch (e: any) {
					console.error(`Test case ${tc.name} execution failed:`, e);
					status = e.killed ? "timed_out" : "error";
				}
				const duration = Date.now() - startTime;

				// Check correctness
				if (status === "passed") {
					const expected = (tc.expectedOutput || "").trim();
					const actual = stdout.trim();
					if (expected !== actual) {
						status = "failed"; // Wrong Answer
					}
				}

				// Phase 2: Valgrind Execution (Memory Safety)
				// Only run if passed so far
				if (status === "passed") {
					// valgrind --leak-check=full --error-exitcode=1
					const valgrindCmd = `docker run --rm -i -v "${workDir}:/app" -w /app benchmark-runner:latest /bin/sh -c "valgrind --leak-check=full --error-exitcode=1 ${command} < input.in"`;
					try {
						await execAsync(valgrindCmd, { timeout: tc.timeoutSeconds * 2 * 1000 }); // Give more time for valgrind
					} catch (e: any) {
						console.error(`Test case ${tc.name} valgrind failed:`, e);
						// If exit code is 1, it's memory error. If other, it might be timeout or crash.
						// execAsync throws if exit code != 0
						if (e.code === 1) {
							status = "memory_error";
						} else if (e.killed) {
							status = "timed_out"; // Valgrind timed out
						} else {
							status = "error";
						}
					}
				}

				testCaseResults.push({
					testCaseId: tc.id,
					status,
					executionTimeMilliseconds: duration,
					memoryUsageBytes: 0, // TODO: Parse memory usage
				});

				if (status !== "passed") {
					testCaseStatus = "some_failed"; // Or all_failed logic
				}
			}

			if (testCaseResults.every((r) => r.status !== "passed")) {
				testCaseStatus = "all_failed";
			} else if (testCaseResults.some((r) => r.status !== "passed")) {
				testCaseStatus = "some_failed";
			}
		} else {
			testCaseStatus = "all_failed";
		}

		// 4. Save Results
		await db.transaction(async (tx) => {
			const [result] = await tx
				.insert(BenchmarkResults)
				.values({
					benchmarkId: job.benchmarkId,
					submittedBy: job.requestedBy,
					submittedFileId: job.submittedFileId,
					submittedAt: new Date(),
					score: testCaseResults.filter((r) => r.status === "passed").length, // Simple score: number of passed tests
					testCaseStatus: testCaseStatus as any,
				})
				.returning();

			if (stepResults.length > 0) {
				await tx
					.insert(BenchmarkStepResults)
					.values(stepResults.map((r) => ({ ...r, benchmarkResultId: result.id })));
			}

			if (testCaseResults.length > 0) {
				await tx
					.insert(TestCaseResults)
					.values(testCaseResults.map((r) => ({ ...r, benchmarkResultId: result.id })));
			}

			await tx
				.update(BenchmarkQueueJobs)
				.set({
					status: "completed",
					finishedAt: new Date(),
					benchmarkResultId: result.id,
				})
				.where(eq(BenchmarkQueueJobs.id, job.id));
		});
	} catch (error) {
		console.error(`Job ${job.id} failed:`, error);
		await db
			.update(BenchmarkQueueJobs)
			.set({ status: "failed", finishedAt: new Date() })
			.where(eq(BenchmarkQueueJobs.id, job.id));
	} finally {
		// Cleanup workDir
		await rm(workDir, { recursive: true, force: true });
	}
}

export async function runWorker() {
	await ensureRunnerImage();
	console.log("Worker started polling...");
	while (true) {
		try {
			const job = await db.query.BenchmarkQueueJobs.findFirst({
				where: eq(BenchmarkQueueJobs.status, "waiting"),
				orderBy: (jobs, { asc }) => [asc(jobs.submittedAt)],
				with: {
					benchmark: {
						with: {
							testCases: {
								with: {
									assets: true,
								},
							},
							benchmarkSteps: {
								with: {
									assets: true,
								},
							},
						},
					},
				},
			});

			if (job) {
				await db
					.update(BenchmarkQueueJobs)
					.set({ status: "running", startedAt: new Date() })
					.where(eq(BenchmarkQueueJobs.id, job.id));

				await processJob(job);
			} else {
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}
		} catch (e) {
			console.error("Worker loop error:", e);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
}

runWorker();
