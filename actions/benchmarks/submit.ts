"use server";

import { ActionSuccess, action } from "@/lib/action";
import { submitSolutionSchema } from "@/lib/schema/benchmarks";
import { createFile } from "@/lib/data/benchmarks";
import { db, BenchmarkQueueJobs } from "@/lib/db";

export const submitSolutionAction = action({
	authorizationGroup: "user",
	schema: submitSolutionSchema,
	async action(data, { user }) {
		// Create a file record for the source code
		// Note: In a real implementation, you would store the actual file content
		// somewhere (e.g., S3, filesystem) and just store metadata in the database
		const file = await createFile({
			uploadedAt: new Date(),
			uploadedBy: user.id,
			sizeBytes: data.sourceCode.length,
		});

		// Create a benchmark queue job
		await db.insert(BenchmarkQueueJobs).values({
			benchmarkId: data.benchmarkId,
			submittedFileId: file.id,
			requestedBy: user.id,
			status: "waiting",
			submittedAt: new Date(),
		});

		return ActionSuccess("Solution submitted successfully! It will be processed shortly.");
	},
});
