import "server-only";

import { User } from "@/lib/types";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const useAuth = cache(async (): Promise<User> => {
	const session = await auth();

	if (!session?.user) throw new Error("Called useAuth without a session");

	const user = await db.query.Users.findFirst({
		columns: {
			id: true,
			nickname: true,
			colors: true,
			type: true,
		},
		where: (users, { eq, and }) => and(eq(users.id, session.user!.id), eq(users.type, session.user!.type)),
	});

	if (!user) redirect("/api/auth/revalidate");

	console.log(user);

	return user;
});
