import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getBenchmarks } from "@/lib/data/benchmarks";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NextPage } from "next";

const BenchmarksPage: NextPage = async () => {
	const benchmarks = await getBenchmarks();

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Available Benchmarks</h1>
				<p className="text-muted-foreground mt-2">
					Choose a benchmark to submit your solution and see how it performs.
				</p>
			</div>

			<div className="grid gap-6">
				{benchmarks.length === 0 ? (
					<Card>
						<CardContent className="py-10 text-center">
							<p className="text-muted-foreground">No benchmarks available yet. Check back later!</p>
						</CardContent>
					</Card>
				) : (
					benchmarks.map((benchmark) => (
						<Card key={benchmark.id} className="hover:border-primary transition-colors">
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle>{benchmark.name}</CardTitle>
										<CardDescription className="mt-2">{benchmark.description}</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="mb-4 space-y-2 text-sm">
									<div>
										<span className="text-muted-foreground">Build Command:</span>
										<code className="bg-muted ml-2 rounded px-2 py-1">{benchmark.buildCommandPreview}</code>
									</div>
									<div>
										<span className="text-muted-foreground">Scoring:</span>
										<span className="ml-2">{benchmark.scoreCalculationDescription}</span>
									</div>
								</div>
								<div className="flex justify-end gap-2">
									<Link href={`/benchmarks/${benchmark.id}`}>
										<Button>
											View Details
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>
		</div>
	);
};

export default BenchmarksPage;
