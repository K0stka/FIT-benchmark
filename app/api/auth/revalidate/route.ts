import { NextRequest, NextResponse } from "next/server";
import { Users, db, eq } from "@/lib/db";
import { auth, signOut } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
	const session = await auth();

	if (!session || !session.user) return NextResponse.redirect(new URL("/logged-out", req.url));

	const user = await db.query.Users.findFirst({
		where: eq(Users.id, session.user.id),
	});

	if (!user || user.type !== session.user!.type) await signOut({ redirectTo: "/logged-out" });

	return NextResponse.redirect(new URL("/", req.url));
};
