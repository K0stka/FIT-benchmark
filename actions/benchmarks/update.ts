"use server";

import { ActionSuccess, action } from "@/lib/action";
import { benchmarkSchema, benchmarkIdSchema } from "@/lib/schema/benchmarks";
import { updateBenchmark } from "@/lib/data/benchmarks";

const updateBenchmarkSchema = benchmarkIdSchema.merge(benchmarkSchema);

export const updateBenchmarkAction = action({
	authorizationGroup: "admin",
	schema: updateBenchmarkSchema,
	async action(data) {
		const { id, ...benchmarkData } = data;
		const benchmark = await updateBenchmark(id, benchmarkData);
		return ActionSuccess(`Benchmark "${benchmark.name}" byl úspěšně aktualizován`);
	},
});
