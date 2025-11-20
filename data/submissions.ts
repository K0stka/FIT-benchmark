import { db, eq, desc, and } from "@/lib/db";
import { BenchmarkQueueJobs, Files } from "@/lib/db/models";

export async function createSubmission(benchmarkId: number, userId: number, fileId: number) {
	const result = await db
		.insert(BenchmarkQueueJobs)
		.values({
			benchmarkId,
			submittedFileId: fileId,
			requestedBy: userId,
			status: "waiting",
			submittedAt: new Date(),
		})
		.returning();
	return result[0];
}

export async function getSubmissionsByUser(userId: number) {
	return await db.query.BenchmarkQueueJobs.findMany({
		where: eq(BenchmarkQueueJobs.requestedBy, userId),
		orderBy: [desc(BenchmarkQueueJobs.submittedAt)],
		with: {
			benchmark: true,
		},
	});
}

export async function getSubmissionsByBenchmark(benchmarkId: number) {
	return await db.query.BenchmarkQueueJobs.findMany({
		where: eq(BenchmarkQueueJobs.benchmarkId, benchmarkId),
		orderBy: [desc(BenchmarkQueueJobs.submittedAt)],
		with: {
			requestedBy: true,
		},
	});
}

export async function getNextQueuedJob() {
	return await db.query.BenchmarkQueueJobs.findFirst({
		where: eq(BenchmarkQueueJobs.status, "waiting"),
		orderBy: [BenchmarkQueueJobs.submittedAt],
		with: {
			benchmark: true,
		},
	});
}

export async function updateJobStatus(
	jobId: number,
	status: "waiting" | "running" | "completed" | "failed",
	updates: {
		startedAt?: Date;
		finishedAt?: Date;
		benchmarkResultId?: number;
	} = {}
) {
	const result = await db
		.update(BenchmarkQueueJobs)
		.set({
			status,
			...updates,
		})
		.where(eq(BenchmarkQueueJobs.id, jobId))
		.returning();
	return result[0];
}

export async function createFile(uploadedBy: number, sizeBytes: number) {
	const result = await db
		.insert(Files)
		.values({
			uploadedAt: new Date(),
			uploadedBy,
			sizeBytes,
		})
		.returning();
	return result[0];
}
