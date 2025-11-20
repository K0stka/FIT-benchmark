import { db, eq, desc, and, sql } from "@/lib/db";
import { BenchmarkResults, TestCaseResults, BenchmarkStepResults, BenchmarkQueueJobs } from "@/lib/db/models";
import { BenchmarkResult, TestCaseResult, BenchmarkStepResult } from "@/lib/types";

export async function createBenchmarkResult(data: Omit<BenchmarkResult, "id">) {
	const result = await db.insert(BenchmarkResults).values(data).returning();
	return result[0];
}

export async function createTestCaseResult(data: Omit<TestCaseResult, "id">) {
	const result = await db.insert(TestCaseResults).values(data).returning();
	return result[0];
}

export async function createBenchmarkStepResult(data: Omit<BenchmarkStepResult, "id">) {
	const result = await db.insert(BenchmarkStepResults).values(data).returning();
	return result[0];
}

export async function getResultsByBenchmark(benchmarkId: number) {
	return await db.query.BenchmarkResults.findMany({
		where: eq(BenchmarkResults.benchmarkId, benchmarkId),
		orderBy: [desc(BenchmarkResults.score), desc(BenchmarkResults.submittedAt)],
		with: {
			submittedBy: true,
			testCaseResults: {
				with: {
					testCase: true,
				},
			},
			benchmarkStepResults: {
				with: {
					benchmarkStep: true,
				},
			},
		},
	});
}

export async function getResultsByUser(userId: number) {
	return await db.query.BenchmarkResults.findMany({
		where: eq(BenchmarkResults.submittedBy, userId),
		orderBy: [desc(BenchmarkResults.submittedAt)],
		with: {
			benchmark: true,
			testCaseResults: true,
			benchmarkStepResults: true,
		},
	});
}

export async function getLeaderboard(benchmarkId: number, limit = 100) {
	// Get full result details for best submissions
	// For now, just return all results ordered by score (assuming lower is better for time, but let's use ASC for time)
	// Wait, if score is time, ASC is better.
	const leaderboard = await db.query.BenchmarkResults.findMany({
		where: eq(BenchmarkResults.benchmarkId, benchmarkId),
		orderBy: [desc(BenchmarkResults.score), desc(BenchmarkResults.submittedAt)], // TODO: Make sort order configurable per benchmark
		limit,
		with: {
			submittedBy: true,
			testCaseResults: {
				with: {
					testCase: true,
				},
			},
			benchmarkStepResults: {
				with: {
					benchmarkStep: true,
				},
			},
		},
	});

	return leaderboard;
}

export async function getResultById(resultId: number) {
	return await db.query.BenchmarkResults.findFirst({
		where: eq(BenchmarkResults.id, resultId),
		with: {
			submittedBy: true,
			benchmark: true,
			testCaseResults: {
				with: {
					testCase: true,
				},
			},
			benchmarkStepResults: {
				with: {
					benchmarkStep: true,
				},
			},
		},
	});
}

export async function getRecentResults(limit = 10) {
	return await db.query.BenchmarkResults.findMany({
		orderBy: [desc(BenchmarkResults.submittedAt)],
		limit,
		with: {
			submittedBy: true,
			benchmark: true,
		},
	});
}
