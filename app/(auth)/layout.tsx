import { Card } from "@/components/ui/card";
import Link from "next/link";
import Logo from "@/components/Logo";
import { NextLayout } from "@/lib/utilityTypes";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Layout: NextLayout = ({ children }) => {
	return (
		<main className="relative flex min-h-dvh w-dvw items-center-safe justify-center-safe overflow-hidden bg-linear-to-br from-background via-background dark:to-muted/20 to-black/10">
			<Link href="/">
				<Logo className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6" />
			</Link>

			<Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">{children}</Card>

			<div className="fixed bottom-4 right-4 z-10 sm:bottom-6 sm:right-6">
				<ThemeToggle />
			</div>
		</main>
	);
};

export default Layout;
