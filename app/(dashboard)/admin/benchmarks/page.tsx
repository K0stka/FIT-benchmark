import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBenchmarks } from "@/lib/data/benchmarks";
import { Plus } from "lucide-react";
import Link from "next/link";
import { NextPage } from "next";
import { useAuth } from "@/hooks/useAuth";

const AdminBenchmarksPage: NextPage = async () => {
	const auth = await useAuth().catch(() => null);

	if (!auth || auth.type !== "admin") {
		return (
			<div className="container py-10">
				<Card>
					<CardHeader>
						<CardTitle>Unauthorized</CardTitle>
						<CardDescription>You do not have permission to access this page.</CardDescription>
					</CardHeader>
				</Card>
			</div>
		);
	}

	const benchmarks = await getBenchmarks();

	return (
		<div className="container py-10">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Manage Benchmarks</h1>
					<p className="text-muted-foreground mt-2">Create and edit benchmarks for users to submit solutions.</p>
				</div>
				<Link href="/admin/benchmarks/new">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						New Benchmark
					</Button>
				</Link>
			</div>

			<div className="grid gap-6">
				{benchmarks.length === 0 ? (
					<Card>
						<CardContent className="py-10 text-center">
							<p className="text-muted-foreground">No benchmarks yet. Create your first benchmark to get started.</p>
						</CardContent>
					</Card>
				) : (
					benchmarks.map((benchmark) => (
						<Card key={benchmark.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle>{benchmark.name}</CardTitle>
										<CardDescription className="mt-2">{benchmark.description}</CardDescription>
									</div>
									<Link href={`/admin/benchmarks/${benchmark.id}/edit`}>
										<Button variant="outline" size="sm">
											Edit
										</Button>
									</Link>
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-muted-foreground text-sm">
									<p className="mb-2">
										<span className="font-medium">Build Command:</span> {benchmark.buildCommandPreview}
									</p>
									<p>
										<span className="font-medium">Score Calculation:</span> {benchmark.scoreCalculationDescription}
									</p>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};

export default AdminBenchmarksPage;
