"use server";

import { ActionSuccess, action } from "@/lib/action";
import { BenchmarkAssets, BenchmarkSteps, Benchmarks, TestCaseAssets, TestCases, db } from "@/lib/db";

import { createBenchmarkSchema } from "@/lib/schema/benchmark";

export const createBenchmark = action({
	authorizationGroup: "admin",
	schema: createBenchmarkSchema,
	async action(data) {
		await db.transaction(async (tx) => {
			const [benchmark] = await tx
				.insert(Benchmarks)
				.values({
					name: data.name,
					description: data.description,
					buildCommandPreview: data.buildCommandPreview,
					buildCommandTemplate: data.buildCommandTemplate,
					buildDebugCommandTemplate: data.buildDebugCommandTemplate,
					scoreCalculationDescription: data.scoreCalculationDescription,
				})
				.returning();

			if (data.steps && data.steps.length > 0) {
				for (const step of data.steps) {
					const [insertedStep] = await tx
						.insert(BenchmarkSteps)
						.values({
							name: step.name,
							description: step.description,
							order: step.order,
							commandPreview: step.commandPreview,
							commandTemplate: step.commandTemplate,
							timeoutSeconds: step.timeoutSeconds,
							benchmarkId: benchmark.id,
						})
						.returning();

					if (step.assets && step.assets.length > 0) {
						await tx.insert(BenchmarkAssets).values(
							step.assets.map((asset) => ({
								benchmarkStepId: insertedStep.id,
								fileId: asset.fileId,
								filename: asset.filename,
							}))
						);
					}
				}
			}

			if (data.testCases && data.testCases.length > 0) {
				for (const tc of data.testCases) {
					const [insertedTC] = await tx
						.insert(TestCases)
						.values({
							name: tc.name,
							description: tc.description,
							order: tc.order,
							testCommandPreview: tc.testCommandPreview,
							testCommandTemplate: tc.testCommandTemplate,
							timeoutSeconds: tc.timeoutSeconds,
							benchmarkId: benchmark.id,
							input: tc.input || "",
							expectedOutput: tc.expectedOutput || "",
						})
						.returning();

					if (tc.assets && tc.assets.length > 0) {
						await tx.insert(TestCaseAssets).values(
							tc.assets.map((asset) => ({
								testCaseId: insertedTC.id,
								fileId: asset.fileId,
								filename: asset.filename,
							}))
						);
					}
				}
			}
		});

		return ActionSuccess("Benchmark created successfully");
	},
});
