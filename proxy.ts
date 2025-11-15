import { NextProxy, NextResponse } from "next/server";

import { EdgeAuth } from "./lib/auth/auth.base";
import { usePages } from "./hooks/usePages";

const proxy: NextProxy = async (req) => {
	const session = await EdgeAuth();

	if (session?.user && req.nextUrl.pathname.startsWith("/login")) return NextResponse.redirect(new URL("/", req.url));

	const pages = usePages(session?.user ?? null);

	if (
		pages.some((page) => {
			if (page.extendable) return req.nextUrl.pathname.startsWith(page.path);
			return req.nextUrl.pathname === page.path;
		})
	)
		return NextResponse.next();

	return NextResponse.rewrite(new URL("/404", req.url));
};

export default proxy;

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
