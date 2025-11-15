import {
	BenchmarkAssets,
	BenchmarkQueueJobs,
	BenchmarkResults,
	BenchmarkStepResults,
	BenchmarkSteps,
	Benchmarks,
	Files,
	Logs,
	TestCaseAssets,
	TestCaseResults,
	TestCases,
	Users,
} from "./models";

import { relations } from "drizzle-orm";

export const userRelations = relations(Users, ({ many }) => ({
	logs: many(Logs),
	uploadedFiles: many(Files),
	benchmarkQueueJobs: many(BenchmarkQueueJobs),
	benchmarkResults: many(BenchmarkResults),
}));

export const logRelations = relations(Logs, ({ one }) => ({
	user: one(Users, { fields: [Logs.userId], references: [Users.id] }),
}));

export const fileRelations = relations(Files, ({ one, many }) => ({
	uploadedBy: one(Users, { fields: [Files.uploadedBy], references: [Users.id] }),
	testCaseAssets: many(TestCaseAssets),
	benchmarkAssets: many(BenchmarkAssets),
	benchmarkQueueJobs: many(BenchmarkQueueJobs),
	benchmarkResults: many(BenchmarkResults),
}));

export const benchmarkRelations = relations(Benchmarks, ({ many }) => ({
	testCases: many(TestCases),
	benchmarkSteps: many(BenchmarkSteps),
	queueJobs: many(BenchmarkQueueJobs),
	results: many(BenchmarkResults),
}));

export const testCaseRelations = relations(TestCases, ({ one, many }) => ({
	benchmark: one(Benchmarks, { fields: [TestCases.benchmarkId], references: [Benchmarks.id] }),
	assets: many(TestCaseAssets),
	results: many(TestCaseResults),
}));

export const testCaseAssetRelations = relations(TestCaseAssets, ({ one }) => ({
	testCase: one(TestCases, { fields: [TestCaseAssets.testCaseId], references: [TestCases.id] }),
	file: one(Files, { fields: [TestCaseAssets.fileId], references: [Files.id] }),
}));

export const benchmarkStepRelations = relations(BenchmarkSteps, ({ one, many }) => ({
	benchmark: one(Benchmarks, { fields: [BenchmarkSteps.benchmarkId], references: [Benchmarks.id] }),
	assets: many(BenchmarkAssets),
	results: many(BenchmarkStepResults),
}));

export const benchmarkAssetRelations = relations(BenchmarkAssets, ({ one }) => ({
	benchmarkStep: one(BenchmarkSteps, { fields: [BenchmarkAssets.benchmarkStepId], references: [BenchmarkSteps.id] }),
	file: one(Files, { fields: [BenchmarkAssets.fileId], references: [Files.id] }),
}));

export const benchmarkQueueJobRelations = relations(BenchmarkQueueJobs, ({ one }) => ({
	benchmark: one(Benchmarks, { fields: [BenchmarkQueueJobs.benchmarkId], references: [Benchmarks.id] }),
	submittedFile: one(Files, { fields: [BenchmarkQueueJobs.submittedFileId], references: [Files.id] }),
	requestedBy: one(Users, { fields: [BenchmarkQueueJobs.requestedBy], references: [Users.id] }),
	benchmarkResult: one(BenchmarkResults, {
		fields: [BenchmarkQueueJobs.benchmarkResultId],
		references: [BenchmarkResults.id],
	}),
}));

export const benchmarkResultRelations = relations(BenchmarkResults, ({ one, many }) => ({
	benchmark: one(Benchmarks, { fields: [BenchmarkResults.benchmarkId], references: [Benchmarks.id] }),
	submittedBy: one(Users, { fields: [BenchmarkResults.submittedBy], references: [Users.id] }),
	submittedFile: one(Files, { fields: [BenchmarkResults.submittedFileId], references: [Files.id] }),
	queueJobs: many(BenchmarkQueueJobs),
	testCaseResults: many(TestCaseResults),
	benchmarkStepResults: many(BenchmarkStepResults),
}));

export const testCaseResultRelations = relations(TestCaseResults, ({ one }) => ({
	benchmarkResult: one(BenchmarkResults, {
		fields: [TestCaseResults.benchmarkResultId],
		references: [BenchmarkResults.id],
	}),
	testCase: one(TestCases, { fields: [TestCaseResults.testCaseId], references: [TestCases.id] }),
}));

export const benchmarkStepResultRelations = relations(BenchmarkStepResults, ({ one }) => ({
	benchmarkResult: one(BenchmarkResults, {
		fields: [BenchmarkStepResults.benchmarkResultId],
		references: [BenchmarkResults.id],
	}),
	benchmarkStep: one(BenchmarkSteps, {
		fields: [BenchmarkStepResults.benchmarkStepId],
		references: [BenchmarkSteps.id],
	}),
}));
