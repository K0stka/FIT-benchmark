import { db, eq } from "@/lib/db";
import { BenchmarkSteps, BenchmarkAssets } from "@/lib/db/models";
import { BenchmarkStep } from "@/lib/types";

export async function getBenchmarkStepsByBenchmarkId(benchmarkId: number) {
	return await db.query.BenchmarkSteps.findMany({
		where: eq(BenchmarkSteps.benchmarkId, benchmarkId),
		orderBy: [BenchmarkSteps.order],
		with: {
			assets: true,
		},
	});
}

export async function createBenchmarkStep(data: Omit<BenchmarkStep, "id">) {
	const result = await db.insert(BenchmarkSteps).values(data).returning();
	return result[0];
}

export async function updateBenchmarkStep(id: number, data: Partial<Omit<BenchmarkStep, "id">>) {
	const result = await db.update(BenchmarkSteps).set(data).where(eq(BenchmarkSteps.id, id)).returning();
	return result[0];
}

export async function deleteBenchmarkStep(id: number) {
	await db.delete(BenchmarkSteps).where(eq(BenchmarkSteps.id, id));
}

export async function createBenchmarkAsset(benchmarkStepId: number, filename: string, fileId: number) {
	const result = await db
		.insert(BenchmarkAssets)
		.values({
			benchmarkStepId,
			filename,
			fileId,
		})
		.returning();
	return result[0];
}
