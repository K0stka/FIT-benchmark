"use server";

import { ActionSuccess, action } from "@/lib/action";
import { benchmarkIdSchema } from "@/lib/schema/benchmarks";
import { deleteBenchmark } from "@/lib/data/benchmarks";

export const deleteBenchmarkAction = action({
	authorizationGroup: "admin",
	schema: benchmarkIdSchema,
	async action(data) {
		await deleteBenchmark(data.id);
		return ActionSuccess("Benchmark byl úspěšně smazán");
	},
});
