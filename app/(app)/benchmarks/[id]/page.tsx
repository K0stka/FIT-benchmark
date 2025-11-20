import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { SubmitSolutionForm } from "@/components/benchmark/SubmitSolutionForm";
import { getBenchmarkById } from "@/data/benchmarks";
import { notFound } from "next/navigation";

import { Leaderboard } from "@/components/benchmark/Leaderboard";
import { Terminal, Trophy } from "lucide-react";

export default async function BenchmarkPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const benchmarkId = parseInt(id);
	if (isNaN(benchmarkId)) notFound();

	const benchmark = await getBenchmarkById(benchmarkId);
	if (!benchmark) notFound();

	return (
		<div className="container mx-auto py-10 space-y-8">
			<div className="flex flex-col gap-2">
				<h1 className="text-4xl font-bold tracking-tight">{benchmark.name}</h1>
				<p className="text-xl text-muted-foreground max-w-3xl">{benchmark.description}</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2 space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Trophy className="h-5 w-5" />
								Leaderboard
							</CardTitle>
							<CardDescription>Top performing solutions.</CardDescription>
						</CardHeader>
						<CardContent>
							<Leaderboard benchmarkId={benchmark.id} />
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Steps</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Step</TableHead>
											<TableHead className="text-right">Timeout</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{benchmark.benchmarkSteps.map((step) => (
											<TableRow key={step.id}>
												<TableCell>
													<div className="font-medium">{step.name}</div>
													<div className="text-xs text-muted-foreground">
														{step.description}
													</div>
												</TableCell>
												<TableCell className="text-right">{step.timeoutSeconds}s</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Test Cases</CardTitle>
							</CardHeader>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Case</TableHead>
											<TableHead className="text-right">Timeout</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{benchmark.testCases.map((tc) => (
											<TableRow key={tc.id}>
												<TableCell>
													<div className="font-medium">{tc.name}</div>
													<div className="text-xs text-muted-foreground">
														{tc.description}
													</div>
												</TableCell>
												<TableCell className="text-right">{tc.timeoutSeconds}s</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</div>
				</div>

				<div className="space-y-6">
					<SubmitSolutionForm benchmarkId={benchmark.id} />

					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<Terminal className="h-4 w-4" />
								Build Configuration
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<div className="text-sm font-medium mb-1">Build Command</div>
								<code className="block bg-muted p-3 rounded-md text-xs font-mono break-all">
									{benchmark.buildCommandPreview}
								</code>
							</div>
							<div>
								<div className="text-sm font-medium mb-1">Scoring</div>
								<p className="text-sm text-muted-foreground">{benchmark.scoreCalculationDescription}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
