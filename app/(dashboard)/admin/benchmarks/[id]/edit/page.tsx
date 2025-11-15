"use client";

import { BenchmarkForm } from "@/components/BenchmarkForm";
import { updateBenchmarkAction } from "@/actions/benchmarks/update";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";
import { BenchmarkSchema } from "@/lib/schema/benchmarks";
import { useEffect, useState } from "react";
import { Benchmark } from "@/lib/types";

export default function EditBenchmarkPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { action: updateAction, pending } = useAction(updateBenchmarkAction);
	const [benchmark, setBenchmark] = useState<Benchmark | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/api/benchmarks/${params.id}`)
			.then((res) => res.json())
			.then((data) => {
				setBenchmark(data);
				setLoading(false);
			})
			.catch(() => {
				router.push("/admin/benchmarks");
			});
	}, [params.id, router]);

	const handleSubmit = async (data: BenchmarkSchema) => {
		const response = await updateAction({ id: parseInt(params.id), ...data });
		if (response.result === "success") {
			router.push("/admin/benchmarks");
		}
	};

	if (loading) {
		return (
			<div className="container py-10">
				<p>Loading...</p>
			</div>
		);
	}

	if (!benchmark) {
		return (
			<div className="container py-10">
				<p>Benchmark not found</p>
			</div>
		);
	}

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Edit Benchmark</h1>
				<p className="text-muted-foreground mt-2">Update the benchmark configuration.</p>
			</div>

			<BenchmarkForm
				initialData={{
					name: benchmark.name,
					description: benchmark.description,
					buildCommandPreview: benchmark.buildCommandPreview,
					buildCommandTemplate: benchmark.buildCommandTemplate,
					buildDebugCommandTemplate: benchmark.buildDebugCommandTemplate,
					scoreCalculationDescription: benchmark.scoreCalculationDescription,
				}}
				onSubmit={handleSubmit}
				pending={pending}
				submitLabel="Update Benchmark"
			/>
		</div>
	);
}
