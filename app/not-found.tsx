import { AlertCircle, ArrowLeft } from "lucide-react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import Layout from "./(auth)/layout";
import Link from "next/link";

export default function NotFound() {
	return (
		<Layout>
			<CardHeader>
				<CardTitle className="text-2xl flex items-center gap-2">
					<AlertCircle className="h-5 w-5 text-destructive" />
					404
				</CardTitle>
				<CardDescription>Stránka nenalezena</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<p className="text-sm text-muted-foreground">
					Tato stránka neexistuje nebo byla přesunuta. Zkontrolujte URL adresu, nebo se vraťte na hlavní
					stránku.
				</p>
				<Link
					href="/"
					className="hover:bg-muted/50 border-input flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors">
					<ArrowLeft className="h-4 w-4" />
					Zpět na hlavní stránku
				</Link>
			</CardContent>
		</Layout>
	);
}
