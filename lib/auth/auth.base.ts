import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { User } from "../types";

export const AuthBase = {
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.type = user.type;
			}

			return token;
		},
		session({ session, token }) {
			session.user.id = token.id as never;
			session.user.type = token.type as User["type"];

			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	providers: [],
} satisfies NextAuthConfig;

export const EdgeAuth = NextAuth(AuthBase).auth;
