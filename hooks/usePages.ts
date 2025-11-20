import { BarChart, LucideIcon, Plus, Star } from "lucide-react";

import { Either } from "@/lib/utilityTypes";
import { User } from "@/lib/types";
import { isAuthorized } from "@/lib/auth/authorization";

export type Page = {
	path: string;
	extendable?: boolean;
} & Either<{ title: string; icon: LucideIcon }, {}>;

const PUBLIC_PAGES: Page[] = [{ path: "/" }];

export const usePages = (user: Pick<User, "type"> | null): Page[] => {
	const pages: Page[] = [...PUBLIC_PAGES];

	if (isAuthorized(user, "anonymous")) {
		pages.push({ path: "/login", extendable: true }, { path: "/register" }, { path: "/logged-out" });
	} else if (isAuthorized(user, "user")) {
		pages.push(
			{
				title: "Benchmarks",
				icon: BarChart,
				path: "/benchmarks",
				extendable: true,
			},
			{
				title: "Moje výsledky",
				icon: Star,
				path: "/my-results",
			},
			{
				title: "Nastavení",
				icon: Star,
				path: "/settings",
			}
		);

		if (isAuthorized(user, "admin")) {
			pages.push({
				title: "Admin",
				icon: Plus,
				path: "/admin",
				extendable: true,
			});
		}
	}

	return pages;
};
