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
				<h1 className="mb-4 text-4xl font-bold">Vítejte v FIT Benchmark</h1>
				<p className="text-muted-foreground text-lg">
					Testujte a benchmarkujte své algoritmy proti náročným problémům
				</p>
			</div>

			<div className="mb-10 grid gap-6 md:grid-cols-3">
				<Card>
					<CardHeader>
						<Code className="mb-2 h-8 w-8" />
						<CardTitle>Odesílejte řešení</CardTitle>
						<CardDescription>Nahrajte svou implementaci a sledujte, jak si vede</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<TrendingUp className="mb-2 h-8 w-8" />
						<CardTitle>Sledujte výkon</CardTitle>
						<CardDescription>Získejte podrobné metriky o době provádění a efektivitě</CardDescription>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<Award className="mb-2 h-8 w-8" />
						<CardTitle>Soutěžte</CardTitle>
						<CardDescription>Porovnejte své výsledky s ostatními uživateli</CardDescription>
					</CardHeader>
				</Card>
			</div>

			<div className="flex justify-center gap-4">
				{auth ? (
					<Link href="/benchmarks">
						<Button size="lg">Procházet benchmarky</Button>
					</Link>
				) : (
					<>
						<Link href="/login">
							<Button size="lg">Přihlásit se</Button>
						</Link>
						<Link href="/register">
							<Button size="lg" variant="outline">
								Zaregistrovat se
							</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};

export default Page;
