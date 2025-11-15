import NextAuth, { User } from "next-auth";

import { AuthBase } from "./auth.base";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./password";
import { db } from "../db";
import { loginSchema } from "../schema/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
	...AuthBase,
	providers: [
		Credentials({
			name: "Credentials",
			async authorize(values): Promise<User | null> {
				const validated = loginSchema.safeParse(values);

				if (!validated.success) return null;

				const user = await db.query.Users.findFirst({
					where: (users, { eq }) => eq(users.nickname, validated.data.nickname),
				});

				if (!user) return null;

				if (!(await comparePassword(validated.data.password, user.passwordHash))) return null;

				return {
					id: user.id,
					type: user.type,
				};
			},
		}),
	],
});
