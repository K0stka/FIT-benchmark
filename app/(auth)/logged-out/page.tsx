import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Home, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { NextPage } from "next";

const Page: NextPage = async () => {
	return (
		<>
			<CardHeader>
				<div className="bg-primary/10 text-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
					<CheckCircle2 className="h-8 w-8" />
				</div>
				<CardTitle className="text-center text-2xl">Odhlášení proběhlo úspěšně</CardTitle>
				<CardDescription className="text-center">Děkujeme za použití FIT Benchmark</CardDescription>
			</CardHeader>
			<CardContent>
				<Link
					href="/"
					className="block">
					<Button className="w-full flex items-center justify-center gap-2">
						<Home className="h-4 w-4" />
						Zpět na hlavní stránku
					</Button>
				</Link>
			</CardContent>
		</>
	);
};

export default Page;
