import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBenchmarkById } from "@/lib/data/benchmarks";
import { notFound } from "next/navigation";
import { EditBenchmarkForm } from "./EditBenchmarkForm";

export default async function EditBenchmarkPage({ params }: { params: Promise<{ id: string }> }) {
	const { id: idStr } = await params;
	const id = parseInt(idStr);

	if (isNaN(id)) {
		notFound();
	}

	const benchmark = await getBenchmarkById(id);

	if (!benchmark) {
		notFound();
	}

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Upravit benchmark</h1>
				<p className="text-muted-foreground mt-2">Aktualizujte konfiguraci benchmarku.</p>
			</div>

			<EditBenchmarkForm
				benchmarkId={id}
				initialData={{
					name: benchmark.name,
					description: benchmark.description,
					buildCommandPreview: benchmark.buildCommandPreview,
					buildCommandTemplate: benchmark.buildCommandTemplate,
					buildDebugCommandTemplate: benchmark.buildDebugCommandTemplate,
					scoreCalculationDescription: benchmark.scoreCalculationDescription,
				}}
			/>
		</div>
	);
}
