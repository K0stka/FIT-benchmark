"use client";

import { BenchmarkForm } from "@/components/BenchmarkForm";
import { updateBenchmarkAction } from "@/actions/benchmarks/update";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";
import { BenchmarkSchema } from "@/lib/schema/benchmarks";

type EditBenchmarkFormProps = {
	benchmarkId: number;
	initialData: BenchmarkSchema;
};

export function EditBenchmarkForm({ benchmarkId, initialData }: EditBenchmarkFormProps) {
	const router = useRouter();
	const { action: updateAction, pending } = useAction(updateBenchmarkAction);

	const handleSubmit = async (data: BenchmarkSchema) => {
		const response = await updateAction({ id: benchmarkId, ...data });
		if (response.result === "success") {
			router.push("/admin/benchmarks");
		}
	};

	return (
		<BenchmarkForm
			initialData={initialData}
			onSubmit={handleSubmit}
			pending={pending}
			submitLabel="Aktualizovat benchmark"
		/>
	);
}
