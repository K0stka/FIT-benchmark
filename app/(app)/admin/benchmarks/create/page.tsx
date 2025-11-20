import { CreateBenchmarkForm } from "@/components/benchmark/CreateBenchmarkForm";

export default function CreateBenchmarkPage() {
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-8">Create Benchmark</h1>
			<CreateBenchmarkForm />
		</div>
	);
}
