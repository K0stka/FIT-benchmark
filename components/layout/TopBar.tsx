import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserNav } from "./UserNav";

export async function TopBar() {
	const session = await auth();
	let user = null;
	if (session?.user?.id) {
		user = await db.query.Users.findFirst({
			columns: { id: true, nickname: true, colors: true, type: true },
			where: (users, { eq }) => eq(users.id, session.user!.id),
		});
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 flex items-center">
					<Link
						href="/"
						className="mr-6 flex items-center space-x-2">
						<Logo
							className="h-8 w-auto"
							iconOnly
						/>
						<span className="hidden font-bold sm:inline-block">FIT Benchmark</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						{user && (
							<Link
								href="/benchmarks"
								className="transition-colors hover:text-foreground/80 text-foreground/60">
								Benchmarky
							</Link>
						)}
					</nav>
				</div>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none"></div>
					<nav className="flex items-center space-x-2">
						<ThemeToggle />
						{user ? (
							<UserNav user={user} />
						) : (
							<div className="flex gap-2">
								<Button
									variant="ghost"
									asChild
									size="sm">
									<Link href="/login">Přihlásit se</Link>
								</Button>
								<Button
									asChild
									size="sm">
									<Link href="/register">Registrovat</Link>
								</Button>
							</div>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
}
