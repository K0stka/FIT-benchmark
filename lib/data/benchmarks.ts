import { db, eq, desc } from "@/lib/db";
import { 
	Benchmarks, 
	TestCases, 
	BenchmarkSteps,
	Files 
} from "@/lib/db";

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
				orderBy: [TestCases.order],
				with: {
					assets: {
						with: {
							file: true,
						},
					},
				},
			},
			benchmarkSteps: {
				orderBy: [BenchmarkSteps.order],
				with: {
					assets: {
						with: {
							file: true,
						},
					},
				},
			},
		},
	});
}

export async function createBenchmark(data: {
	name: string;
	description: string;
	buildCommandPreview: string;
	buildCommandTemplate: string;
	buildDebugCommandTemplate: string;
	scoreCalculationDescription: string;
}) {
	const result = await db
		.insert(Benchmarks)
		.values(data)
		.returning();
	
	return result[0];
}

export async function updateBenchmark(
	id: number,
	data: {
		name: string;
		description: string;
		buildCommandPreview: string;
		buildCommandTemplate: string;
		buildDebugCommandTemplate: string;
		scoreCalculationDescription: string;
	}
) {
	const result = await db
		.update(Benchmarks)
		.set(data)
		.where(eq(Benchmarks.id, id))
		.returning();
	
	return result[0];
}

export async function deleteBenchmark(id: number) {
	await db.delete(Benchmarks).where(eq(Benchmarks.id, id));
}

export async function createTestCase(data: {
	benchmarkId: number;
	name: string;
	description: string;
	order: number;
	testCommandPreview: string;
	testCommandTemplate: string;
	timeoutSeconds: number;
}) {
	const result = await db
		.insert(TestCases)
		.values(data)
		.returning();
	
	return result[0];
}

export async function updateTestCase(
	id: number,
	data: {
		name: string;
		description: string;
		order: number;
		testCommandPreview: string;
		testCommandTemplate: string;
		timeoutSeconds: number;
	}
) {
	const result = await db
		.update(TestCases)
		.set(data)
		.where(eq(TestCases.id, id))
		.returning();
	
	return result[0];
}

export async function deleteTestCase(id: number) {
	await db.delete(TestCases).where(eq(TestCases.id, id));
}

export async function createBenchmarkStep(data: {
	benchmarkId: number;
	name: string;
	description: string;
	order: number;
	commandPreview: string;
	commandTemplate: string;
	timeoutSeconds: number;
}) {
	const result = await db
		.insert(BenchmarkSteps)
		.values(data)
		.returning();
	
	return result[0];
}

export async function updateBenchmarkStep(
	id: number,
	data: {
		name: string;
		description: string;
		order: number;
		commandPreview: string;
		commandTemplate: string;
		timeoutSeconds: number;
	}
) {
	const result = await db
		.update(BenchmarkSteps)
		.set(data)
		.where(eq(BenchmarkSteps.id, id))
		.returning();
	
	return result[0];
}

export async function deleteBenchmarkStep(id: number) {
	await db.delete(BenchmarkSteps).where(eq(BenchmarkSteps.id, id));
}

export async function createFile(data: {
	uploadedAt: Date;
	uploadedBy: number;
	sizeBytes: number;
}) {
	const result = await db
		.insert(Files)
		.values(data)
		.returning();
	
	return result[0];
}
