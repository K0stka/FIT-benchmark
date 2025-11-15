"use client";

import { BenchmarkForm } from "@/components/BenchmarkForm";
import { createBenchmarkAction } from "@/actions/benchmarks/create";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";
import { BenchmarkSchema } from "@/lib/schema/benchmarks";

export default function NewBenchmarkPage() {
	const router = useRouter();
	const { action: createAction, pending } = useAction(createBenchmarkAction);

	const handleSubmit = async (data: BenchmarkSchema) => {
		const response = await createAction(data);
		if (response.result === "success") {
			router.push("/admin/benchmarks");
		}
	};

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Create New Benchmark</h1>
				<p className="text-muted-foreground mt-2">Set up a new benchmark for users to submit their solutions.</p>
			</div>

			<BenchmarkForm onSubmit={handleSubmit} pending={pending} submitLabel="Create Benchmark" />
		</div>
	);
}
