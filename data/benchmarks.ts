import { db, eq, desc, and } from "@/lib/db";
import { Benchmarks, TestCases, TestCaseAssets, BenchmarkSteps, BenchmarkAssets } from "@/lib/db/models";
import { Benchmark } from "@/lib/types";

export async function getBenchmarks() {
	return await db.query.Benchmarks.findMany({
		orderBy: [desc(Benchmarks.id)],
	});
}

export async function getBenchmarkById(id: number) {
	return await db.query.Benchmarks.findFirst({
		where: eq(Benchmarks.id, id),
		with: {
			testCases: {
				orderBy: [desc(TestCases.order)],
				with: {
					assets: true,
				},
			},
			benchmarkSteps: {
				orderBy: [desc(BenchmarkSteps.order)],
				with: {
					assets: true,
				},
			},
		},
	});
}

export async function createBenchmark(data: Omit<Benchmark, "id">) {
	const result = await db.insert(Benchmarks).values(data).returning();
	return result[0];
}

export async function updateBenchmark(id: number, data: Partial<Omit<Benchmark, "id">>) {
	const result = await db.update(Benchmarks).set(data).where(eq(Benchmarks.id, id)).returning();
	return result[0];
}

export async function deleteBenchmark(id: number) {
	await db.delete(Benchmarks).where(eq(Benchmarks.id, id));
}
