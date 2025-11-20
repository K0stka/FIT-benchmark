import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBenchmarks } from "@/data/benchmarks";
import { getRecentResults } from "@/data/results";
import { ArrowRight, Trophy, Activity, Code2 } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
	const benchmarks = await getBenchmarks();
	const recentResults = await getRecentResults();
	const session = await auth();
	const isLoggedIn = !!session?.user;

	return (
		<>
			{/* Hero Section */}
			<section className="relative py-20 md:py-32 overflow-hidden bg-linear-to-b from-background to-muted/20">
				<div className="container relative z-10 mx-auto px-4 text-center">
					<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 mb-8">
						v1.0 Nyní k dispozici
					</div>
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
						FIT Benchmark
					</h1>
					<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
						Platforma pro porovnávání výkonnosti algoritmů. Odevzdejte svá řešení a změřte síly s ostatními
						studenty.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							asChild
							size="lg"
							className="h-12 px-8 text-lg">
							<Link href={isLoggedIn ? "/benchmarks" : "/login"}>
								{isLoggedIn ? "Procházet benchmarky" : "Začít soutěžit"}{" "}
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							variant="outline"
							size="lg"
							asChild
							className="h-12 px-8 text-lg">
							<Link
								href="https://github.com/your-repo"
								target="_blank">
								Dokumentace
							</Link>
						</Button>
					</div>
				</div>
				{/* Abstract background elements */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
			</section>

			{/* Features Grid */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border shadow-sm">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<Code2 className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Automatické testování</h3>
							<p className="text-muted-foreground">
								Vaše řešení jsou automaticky testována v izolovaném prostředí Docker kontejnerů.
							</p>
						</div>
						<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border shadow-sm">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<Activity className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Okamžitá zpětná vazba</h3>
							<p className="text-muted-foreground">
								Získejte výsledky výkonnosti a správnosti ihned po odevzdání.
							</p>
						</div>
						<div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border shadow-sm">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
								<Trophy className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Žebříčky</h3>
							<p className="text-muted-foreground">
								Sledujte své umístění v reálném čase a soutěžte o nejlepší optimalizaci.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Active Benchmarks */}
			<section className="py-20 container mx-auto px-4">
				<div className="flex justify-between items-center mb-10">
					<div>
						<h2 className="text-3xl font-bold tracking-tight mb-2">Aktivní benchmarky</h2>
						<p className="text-muted-foreground">Vyberte si úlohu a začněte optimalizovat</p>
					</div>
					<Button
						variant="ghost"
						asChild
						className="hidden sm:flex">
						<Link href={isLoggedIn ? "/benchmarks" : "/login"}>
							Zobrazit vše <ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{benchmarks.slice(0, 3).map((benchmark) => (
						<Card
							key={benchmark.id}
							className="group hover:shadow-lg transition-all duration-300 border-muted">
							<CardHeader>
								<CardTitle className="group-hover:text-primary transition-colors">
									{benchmark.name}
								</CardTitle>
								<CardDescription className="line-clamp-2">{benchmark.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Button
									asChild
									className="w-full group-hover:bg-primary/90">
									<Link href={isLoggedIn ? `/benchmarks/${benchmark.id}` : "/login"}>
										{isLoggedIn ? "Detail úlohy" : "Přihlásit se pro detail"}
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
				<div className="mt-6 sm:hidden">
					<Button
						variant="ghost"
						asChild
						className="w-full">
						<Link href={isLoggedIn ? "/benchmarks" : "/login"}>Zobrazit vše</Link>
					</Button>
				</div>
			</section>

			{/* Recent Activity */}
			<section className="py-20 bg-muted/30 border-t">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold tracking-tight mb-8">Nedávná aktivita</h2>
					<Card className="overflow-hidden border-none shadow-md">
						<CardContent className="p-0">
							<Table>
								<TableHeader className="bg-muted/50">
									<TableRow>
										<TableHead>Uživatel</TableHead>
										<TableHead>Benchmark</TableHead>
										<TableHead>Skóre</TableHead>
										<TableHead>Datum</TableHead>
										<TableHead>Stav</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentResults.map((result) => (
										<TableRow
											key={result.id}
											className="hover:bg-muted/50">
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8 border-2 border-background">
														<AvatarFallback
															style={{
																backgroundColor: result.submittedBy.colors.light,
																color: "white",
															}}>
															{result.submittedBy.nickname.substring(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<span className="font-medium">{result.submittedBy.nickname}</span>
												</div>
											</TableCell>
											<TableCell>
												{isLoggedIn ? (
													<Link
														href={`/benchmarks/${result.benchmark.id}`}
														className="hover:text-primary hover:underline font-medium transition-colors">
														{result.benchmark.name}
													</Link>
												) : (
													<span className="font-medium text-muted-foreground">
														{result.benchmark.name}
													</span>
												)}
											</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className="font-mono">
													{result.score.toFixed(2)}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground text-sm">
												{new Date(result.submittedAt).toLocaleDateString("cs-CZ")}
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className="bg-green-500/10 text-green-600 border-green-200">
													Dokončeno
												</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</section>
		</>
	);
}
