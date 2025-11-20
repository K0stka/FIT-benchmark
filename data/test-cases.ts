import { db, eq } from "@/lib/db";
import { TestCases, TestCaseAssets } from "@/lib/db/models";
import { TestCase } from "@/lib/types";

export async function getTestCasesByBenchmarkId(benchmarkId: number) {
	return await db.query.TestCases.findMany({
		where: eq(TestCases.benchmarkId, benchmarkId),
		orderBy: [TestCases.order],
		with: {
			assets: true,
		},
	});
}

export async function createTestCase(data: Omit<TestCase, "id">) {
	const result = await db.insert(TestCases).values(data).returning();
	return result[0];
}

export async function updateTestCase(id: number, data: Partial<Omit<TestCase, "id">>) {
	const result = await db.update(TestCases).set(data).where(eq(TestCases.id, id)).returning();
	return result[0];
}

export async function deleteTestCase(id: number) {
	await db.delete(TestCases).where(eq(TestCases.id, id));
}

export async function createTestCaseAsset(testCaseId: number, filename: string, fileId: number) {
	const result = await db
		.insert(TestCaseAssets)
		.values({
			testCaseId,
			filename,
			fileId,
		})
		.returning();
	return result[0];
}
