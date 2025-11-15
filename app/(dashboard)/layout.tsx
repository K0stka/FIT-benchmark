import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { NextLayout } from "@/lib/utilityTypes";

const DashboardLayout: NextLayout = async ({ children }) => {
	const auth = await useAuth().catch(() => null);

	return (
		<div className="min-h-screen">
			<header className="border-border sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
				<div className="container flex h-16 items-center">
					<div className="mr-4 flex">
						<Link href="/" className="mr-6 flex items-center space-x-2">
							<span className="text-xl font-bold">FIT Benchmark</span>
						</Link>
					</div>
					<nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
						<Link href="/benchmarks" className="hover:text-foreground/80 transition-colors">
							Benchmarky
						</Link>
						{auth?.type === "admin" && (
							<Link href="/admin/benchmarks" className="hover:text-foreground/80 transition-colors">
								Správa
							</Link>
						)}
					</nav>
					<div className="flex items-center space-x-2">
						{auth ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon">
										<User className="h-5 w-5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>{auth.nickname}</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<form
										action={async () => {
											"use server";
											await signOut();
										}}>
										<button type="submit" className="w-full">
											<DropdownMenuItem className="cursor-pointer">
												<LogOut className="mr-2 h-4 w-4" />
												Odhlásit se
											</DropdownMenuItem>
										</button>
									</form>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link href="/login">
								<Button variant="outline">Přihlásit se</Button>
							</Link>
						)}
					</div>
				</div>
			</header>
			<main>{children}</main>
		</div>
	);
};

export default DashboardLayout;
