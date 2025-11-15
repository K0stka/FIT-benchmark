import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { NextPage } from "next";
import { useAuth } from "@/hooks/useAuth";
import { Award, Code, TrendingUp } from "lucide-react";

const Page: NextPage = async () => {
	const auth = await useAuth().catch(() => null);

	return (
		<div className="container py-10">
			<div className="mb-8 text-center">
				<h1 className="mb-4 text-4xl font-bold">Welcome to FIT Benchmark</h1>
				<p className="text-muted-foreground text-lg">
					Test and benchmark your algorithms against challenging problems
				</p>
			</div>

			<div className="mb-10 grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader>
						<Code className="mb-2 h-8 w-8" />
						<CardTitle>Submit Solutions</CardTitle>
						<CardDescription>Upload your implementation and see how it performs</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<TrendingUp className="mb-2 h-8 w-8" />
						<CardTitle>Track Performance</CardTitle>
						<CardDescription>Get detailed metrics on execution time and efficiency</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<Award className="mb-2 h-8 w-8" />
						<CardTitle>Compete</CardTitle>
						<CardDescription>Compare your results with other users</CardDescription>
					</CardHeader>
				</Card>
			</div>

			<div className="flex justify-center gap-4">
				{auth ? (
					<Link href="/benchmarks">
						<Button size="lg">Browse Benchmarks</Button>
					</Link>
				) : (
					<>
						<Link href="/login">
							<Button size="lg">Login</Button>
						</Link>
						<Link href="/register">
							<Button size="lg" variant="outline">
								Register
							</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Page;
