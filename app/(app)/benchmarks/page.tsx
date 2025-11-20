import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBenchmarks } from "@/data/benchmarks";
import { useAuth } from "@/hooks/useAuth";
import { isAuthorized } from "@/lib/auth/authorization";
import { Plus } from "lucide-react";

export default async function BenchmarksListPage() {
	const benchmarks = await getBenchmarks();
	const user = await useAuth().catch(() => null);
	const isAdmin = isAuthorized(user, "admin");

	return (
		<div className="container mx-auto py-10 space-y-8">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Benchmarks</h1>
					<p className="text-muted-foreground mt-2">Explore and compete in various programming challenges.</p>
				</div>
				{isAdmin && (
					<Button asChild>
						<Link href="/admin/benchmarks/create">
							<Plus className="mr-2 h-4 w-4" />
							Create Benchmark
						</Link>
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{benchmarks.map((benchmark) => (
					<Card
						key={benchmark.id}
						className="flex flex-col hover:shadow-lg transition-all duration-200">
						<CardHeader>
							<CardTitle className="text-xl">{benchmark.name}</CardTitle>
							<CardDescription className="line-clamp-3 mt-2">{benchmark.description}</CardDescription>
						</CardHeader>
						<CardContent className="mt-auto pt-0">
							<Button
								asChild
								className="w-full"
								variant="secondary">
								<Link href={`/benchmarks/${benchmark.id}`}>View Details</Link>
							</Button>
						</CardContent>
					</Card>
				))}
				{benchmarks.length === 0 && (
					<div className="col-span-full text-center py-12 text-muted-foreground bg-muted/50 rounded-lg border border-dashed">
						No benchmarks available yet.
					</div>
				)}
			</div>
		</div>
	);
}
