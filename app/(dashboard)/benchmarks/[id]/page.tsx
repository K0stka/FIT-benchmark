import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getBenchmarkById } from "@/lib/data/benchmarks";
import { Upload, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const BenchmarkDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
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
				<h1 className="text-3xl font-bold">{benchmark.name}</h1>
				<p className="text-muted-foreground mt-2">{benchmark.description}</p>
			</div>

			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Konfigurace sestavení</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="text-muted-foreground mb-2 text-sm">Příkaz pro sestavení</p>
							<code className="bg-muted block rounded p-3 text-sm">{benchmark.buildCommandPreview}</code>
						</div>
						<div>
							<p className="text-muted-foreground mb-2 text-sm">Výpočet skóre</p>
							<p className="text-sm">{benchmark.scoreCalculationDescription}</p>
						</div>
					</CardContent>
				</Card>

				{benchmark.testCases && benchmark.testCases.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Testovací případy</CardTitle>
							<CardDescription>
								Tyto testy jsou informativní a pomáhají ověřit, že vaše implementace je správná.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{benchmark.testCases.map((testCase, index) => (
									<div key={testCase.id}>
										{index > 0 && <Separator className="my-4" />}
										<div>
											<div className="mb-2 flex items-center justify-between">
												<h4 className="font-semibold">{testCase.name}</h4>
												<Badge variant="outline" className="text-xs">
													<Clock className="mr-1 h-3 w-3" />
													{testCase.timeoutSeconds}s časový limit
												</Badge>
											</div>
											<p className="text-muted-foreground mb-2 text-sm">{testCase.description}</p>
											<code className="bg-muted block rounded p-2 text-xs">
												{testCase.testCommandPreview}
											</code>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{benchmark.benchmarkSteps && benchmark.benchmarkSteps.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Kroky benchmarku</CardTitle>
							<CardDescription>
								Tyto kroky se používají k vyhodnocení vašeho řešení a výpočtu skóre.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{benchmark.benchmarkSteps.map((step, index) => (
									<div key={step.id}>
										{index > 0 && <Separator className="my-4" />}
										<div>
											<div className="mb-2 flex items-center justify-between">
												<h4 className="font-semibold">{step.name}</h4>
												<Badge variant="outline" className="text-xs">
													<Clock className="mr-1 h-3 w-3" />
													{step.timeoutSeconds}s časový limit
												</Badge>
											</div>
											<p className="text-muted-foreground mb-2 text-sm">{step.description}</p>
											<code className="bg-muted block rounded p-2 text-xs">{step.commandPreview}</code>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				<div className="flex justify-center">
					<Link href={`/benchmarks/${benchmark.id}/submit`}>
						<Button size="lg">
							<Upload className="mr-2 h-5 w-5" />
							Odeslat své řešení
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default BenchmarkDetailPage;
