export const USER_TYPES = ["user", "admin"] as const;

export type User = {
	id: number;
	nickname: string;
	colors: {
		light: string;
		dark: string;
	};
	type: (typeof USER_TYPES)[number];
};

export const LOG_TYPES = ["auth.register"] as const;

export type Log = {
	id: number;
	type: (typeof LOG_TYPES)[number];
	timestamp: Date;
	userId: number | null;
	data: {
		[key: string]: any;
	};
};

export type Flag = {
	id: number;
	name: string;
	value: Record<string, any>;
};

export type File = {
	id: number;
	uploadedAt: Date;
	uploadedBy: User["id"];
	sizeBytes: number;
};

export type Benchmark = {
	id: number;
	name: string;
	description: string;
	buildCommandPreview: string;
	buildCommandTemplate: string;
	buildDebugCommandTemplate: string;
	scoreCalculationDescription: string;
};

export type TestCase = {
	id: number;
	benchmarkId: Benchmark["id"];
	name: string;
	description: string;
	order: number;
	testCommandPreview: string;
	testCommandTemplate: string;
	timeoutSeconds: number;
};

export type TestCaseAsset = {
	id: number;
	testCaseId: TestCase["id"];
	filename: string;
	fileId: File["id"];
};

export type BenchmarkStep = {
	id: number;
	benchmarkId: Benchmark["id"];
	name: string;
	description: string;
	order: number;
	commandPreview: string;
	commandTemplate: string;
	timeoutSeconds: number;
};

export type BenchmarkAsset = {
	id: number;
	benchmarkStepId: BenchmarkStep["id"];
	filename: string;
	fileId: File["id"];
};

export type BenchmarkQueueJob = {
	id: number;
	benchmarkId: Benchmark["id"];
	submittedFileId: File["id"];
	requestedBy: User["id"];
	status: "waiting" | "running" | "completed" | "failed";
	submittedAt: Date;
	startedAt: Date | null;
	finishedAt: Date | null;
	benchmarkResultId: BenchmarkResult["id"] | null;
};

export type BenchmarkResult = {
	id: number;
	benchmarkId: Benchmark["id"];
	submittedBy: User["id"];
	submittedFileId: File["id"];
	submittedAt: Date;
	score: number;
	testCaseStatus: "all_passed" | "some_failed" | "all_failed";
};

export type TestCaseResult = {
	id: number;
	benchmarkResultId: BenchmarkResult["id"];
	testCaseId: TestCase["id"];
	status: "passed" | "failed" | "timed_out" | "error";
	executionTimeMilliseconds: number;
};

export type BenchmarkStepResult = {
	id: number;
	benchmarkResultId: BenchmarkResult["id"];
	benchmarkStepId: BenchmarkStep["id"];
	status: "completed" | "wrong_answer" | "timed_out" | "error";
	executionTimeMilliseconds: number;
};
