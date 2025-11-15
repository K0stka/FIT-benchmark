import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NextPage } from "next";

const DashboardPage: NextPage = async () => {
	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground mt-2">Přehled výsledků a žebříčků</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Žebříčky</CardTitle>
					<CardDescription>Tato sekce bude brzy k dispozici</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">Zde se zobrazí žebříčky nejlepších řešení.</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default DashboardPage;
