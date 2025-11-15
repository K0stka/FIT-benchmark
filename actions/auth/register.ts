"use server";

import { ActionSuccess, action } from "@/lib/action";
import { Users, db } from "../../lib/db";

import { getColorsFromString } from "@/lib/colors";
import { hashPassword } from "../../lib/auth/password";
import { logEvent } from "@/lib/log";
import { registerSchema } from "../../lib/schema/auth";

export const register = action({
	authorizationGroup: "anonymous",

	schema: registerSchema,

	async action(data) {
		const existingUser = await db.query.Users.findFirst({
			where: (Users, { eq }) => eq(Users.nickname, data.nickname),
		});

		if (existingUser) return { error: "Účet s touto přezdívkou již existuje.", offerLogin: true };

		const userId = (
			await db
				.insert(Users)
				.values({
					nickname: data.nickname,
					passwordHash: await hashPassword(data.password),
					colors: getColorsFromString(data.nickname),
					type: "user",
				})
				.returning({
					id: Users.id,
				})
		)[0].id;

		logEvent({
			type: "auth.register",
			userId,
			data: {
				nickname: data.nickname,
			},
		});

		return ActionSuccess("Účet byl úspěšně vytvořen! Nyní se můžete přihlásit.");
	},
});
