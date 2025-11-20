"use server";

import { ActionSuccess, action } from "@/lib/action";
import { BenchmarkQueueJobs, db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { submitSolutionSchema } from "@/lib/schema/submission";

export const submitSolution = action({
	authorizationGroup: "user",
	schema: submitSolutionSchema,
	async action(data, { user }) {
		await db.insert(BenchmarkQueueJobs).values({
			benchmarkId: data.benchmarkId,
			submittedFileId: data.fileId,
			requestedBy: user.id,
			submittedAt: new Date(),
			status: "waiting",
		});

		revalidatePath(`/benchmarks/${data.benchmarkId}`);
		return ActionSuccess("Solution submitted successfully");
	},
});
