import { TopBar } from "@/components/layout/TopBar";
import { NextLayout } from "@/lib/utilityTypes";
import Link from "next/link";
import Logo from "@/components/Logo";

const Layout: NextLayout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<TopBar />
			<main className="flex-1">{children}</main>
			<footer className="py-10 border-t bg-background">
				<div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
					<div className="flex items-center gap-2">
						<Logo
							className="h-5 w-auto grayscale opacity-50"
							iconOnly
						/>
						<span className="text-sm text-muted-foreground">© 2025 FIT Benchmark</span>
					</div>
					<div className="flex gap-6 text-sm text-muted-foreground">
						<Link
							href="#"
							className="hover:text-foreground transition-colors">
							O projektu
						</Link>
						<Link
							href="#"
							className="hover:text-foreground transition-colors">
							Podmínky užití
						</Link>
						<Link
							href="#"
							className="hover:text-foreground transition-colors">
							Kontakt
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
