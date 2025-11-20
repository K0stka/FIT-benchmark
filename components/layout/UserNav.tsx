"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/types";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

export function UserNav({ user }: { user: User }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarFallback style={{ backgroundColor: user.colors.light, color: "white" }}>
							{user.nickname.substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56"
				align="end"
				forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.nickname}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.type === "admin" ? "Administrátor" : "Uživatel"}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link
							href="/"
							className="cursor-pointer">
							<LayoutDashboard className="mr-2 h-4 w-4" />
							<span>Přehled</span>
						</Link>
					</DropdownMenuItem>
					{/* Settings page doesn't exist yet, but requested in prompt "account management menu" */}
					<DropdownMenuItem asChild>
						<Link
							href="/settings"
							className="cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							<span>Nastavení</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => signOut()}
					className="cursor-pointer text-red-600 focus:text-red-600">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Odhlásit se</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
