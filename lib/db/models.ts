import { LOG_TYPES, USER_TYPES, User } from "../types";
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const UserType = pgEnum("user_type", USER_TYPES);

export const Users = pgTable(
	"users",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		nickname: varchar("nickname", { length: 31 }).notNull(),
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		colors: jsonb("colors").notNull().$type<User["colors"]>(),
		type: UserType("type").notNull().default("user"),
	},
	(table) => [uniqueIndex("users_nickname_key").on(table.nickname)]
);

export const LogTypes = pgEnum("log_type", LOG_TYPES);

export const Logs = pgTable(
	"logs",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		type: LogTypes("type").notNull(),
		timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
		userId: integer("user_id").references(() => Users.id),
		data: jsonb("data").$type<Record<string, any>>().default({}).notNull(),
	},
	(table) => [index("logs_user_id_key").on(table.userId), index("logs_type_key").on(table.type)]
);

export const Flags = pgTable("flags", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	value: jsonb("value").$type<Record<string, any>>().notNull().default({}),
});

export const Files = pgTable("files", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	uploadedAt: timestamp("uploaded_at", { mode: "date" }).notNull(),
	uploadedBy: integer("uploaded_by")
		.notNull()
		.references(() => Users.id),
	sizeBytes: integer("size_bytes").notNull(),
});

export const Benchmarks = pgTable("benchmarks", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description").notNull(),
	buildCommandPreview: text("build_command_preview").notNull(),
	buildCommandTemplate: text("build_command_template").notNull(),
	buildDebugCommandTemplate: text("build_debug_command_template").notNull(),
	scoreCalculationDescription: text("score_calculation_description").notNull(),
});

export const TestCases = pgTable(
	"test_cases",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkId: integer("benchmark_id")
			.notNull()
			.references(() => Benchmarks.id),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description").notNull(),
		order: integer("order").notNull(),
		testCommandPreview: text("test_command_preview").notNull(),
		testCommandTemplate: text("test_command_template").notNull(),
		timeoutSeconds: integer("timeout_seconds").notNull(),
		input: text("input").notNull().default(""),
		expectedOutput: text("expected_output").notNull().default(""),
	},
	(table) => [index("test_cases_benchmark_id_key").on(table.benchmarkId)]
);

export const TestCaseAssets = pgTable(
	"test_case_assets",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		testCaseId: integer("test_case_id")
			.notNull()
			.references(() => TestCases.id),
		filename: varchar("filename", { length: 255 }).notNull(),
		fileId: integer("file_id")
			.notNull()
			.references(() => Files.id),
	},
	(table) => [
		index("test_case_assets_test_case_id_key").on(table.testCaseId),
		index("test_case_assets_file_id_key").on(table.fileId),
	]
);

export const BenchmarkSteps = pgTable(
	"benchmark_steps",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkId: integer("benchmark_id")
			.notNull()
			.references(() => Benchmarks.id),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description").notNull(),
		order: integer("order").notNull(),
		commandPreview: text("command_preview").notNull(),
		commandTemplate: text("command_template").notNull(),
		timeoutSeconds: integer("timeout_seconds").notNull(),
	},
	(table) => [index("benchmark_steps_benchmark_id_key").on(table.benchmarkId)]
);

export const BenchmarkAssets = pgTable(
	"benchmark_assets",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkStepId: integer("benchmark_step_id")
			.notNull()
			.references(() => BenchmarkSteps.id),
		filename: varchar("filename", { length: 255 }).notNull(),
		fileId: integer("file_id")
			.notNull()
			.references(() => Files.id),
	},
	(table) => [
		index("benchmark_assets_benchmark_step_id_key").on(table.benchmarkStepId),
		index("benchmark_assets_file_id_key").on(table.fileId),
	]
);

export const BenchmarkQueueJobStatus = pgEnum("benchmark_queue_job_status", [
	"waiting",
	"running",
	"completed",
	"failed",
]);

export const BenchmarkQueueJobs = pgTable(
	"benchmark_queue_jobs",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkId: integer("benchmark_id")
			.notNull()
			.references(() => Benchmarks.id),
		submittedFileId: integer("submitted_file_id")
			.notNull()
			.references(() => Files.id),
		requestedBy: integer("requested_by")
			.notNull()
			.references(() => Users.id),
		status: BenchmarkQueueJobStatus("status").notNull().default("waiting"),
		submittedAt: timestamp("submitted_at", { mode: "date" }).notNull(),
		startedAt: timestamp("started_at", { mode: "date" }),
		finishedAt: timestamp("finished_at", { mode: "date" }),
		benchmarkResultId: integer("benchmark_result_id"),
	},
	(table) => [
		index("benchmark_queue_jobs_benchmark_id_key").on(table.benchmarkId),
		index("benchmark_queue_jobs_requested_by_key").on(table.requestedBy),
		index("benchmark_queue_jobs_status_key").on(table.status),
	]
);

export const TestCaseStatus = pgEnum("test_case_status", ["all_passed", "some_failed", "all_failed"]);

export const BenchmarkResults = pgTable(
	"benchmark_results",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkId: integer("benchmark_id")
			.notNull()
			.references(() => Benchmarks.id),
		submittedBy: integer("submitted_by")
			.notNull()
			.references(() => Users.id),
		submittedFileId: integer("submitted_file_id")
			.notNull()
			.references(() => Files.id),
		submittedAt: timestamp("submitted_at", { mode: "date" }).notNull(),
		score: integer("score").notNull(),
		testCaseStatus: TestCaseStatus("test_case_status").notNull(),
	},
	(table) => [
		index("benchmark_results_benchmark_id_key").on(table.benchmarkId),
		index("benchmark_results_submitted_by_key").on(table.submittedBy),
	]
);

export const TestCaseResultStatus = pgEnum("test_case_result_status", [
	"passed",
	"failed",
	"timed_out",
	"error",
	"memory_error",
]);

export const TestCaseResults = pgTable(
	"test_case_results",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkResultId: integer("benchmark_result_id")
			.notNull()
			.references(() => BenchmarkResults.id),
		testCaseId: integer("test_case_id")
			.notNull()
			.references(() => TestCases.id),
		status: TestCaseResultStatus("status").notNull(),
		executionTimeMilliseconds: integer("execution_time_milliseconds").notNull(),
		memoryUsageBytes: integer("memory_usage_bytes"),
	},
	(table) => [
		index("test_case_results_benchmark_result_id_key").on(table.benchmarkResultId),
		index("test_case_results_test_case_id_key").on(table.testCaseId),
	]
);

export const BenchmarkStepResultStatus = pgEnum("benchmark_step_result_status", [
	"completed",
	"wrong_answer",
	"timed_out",
	"error",
]);

export const BenchmarkStepResults = pgTable(
	"benchmark_step_results",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		benchmarkResultId: integer("benchmark_result_id")
			.notNull()
			.references(() => BenchmarkResults.id),
		benchmarkStepId: integer("benchmark_step_id")
			.notNull()
			.references(() => BenchmarkSteps.id),
		status: BenchmarkStepResultStatus("status").notNull(),
		executionTimeMilliseconds: integer("execution_time_milliseconds").notNull(),
	},
	(table) => [
		index("benchmark_step_results_benchmark_result_id_key").on(table.benchmarkResultId),
		index("benchmark_step_results_benchmark_step_id_key").on(table.benchmarkStepId),
	]
);
