"use server";

import { ActionSuccess, action } from "@/lib/action";
import { benchmarkSchema } from "@/lib/schema/benchmarks";
import { createBenchmark } from "@/lib/data/benchmarks";

export const createBenchmarkAction = action({
	authorizationGroup: "admin",
	schema: benchmarkSchema,
	async action(data) {
		const benchmark = await createBenchmark(data);
		return ActionSuccess(`Benchmark "${benchmark.name}" created successfully`);
	},
});
