import { AuthorizationGroup, isAuthorized } from "@/lib/auth/authorization";

import { User } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import z from "zod";

export class UserError extends Error {}

export type ActionResponse = {
	type: "success" | "user_error" | "server_error";
	message: string;
};

export const ActionSuccess = (message: string): ActionResponse => ({
	type: "success",
	message,
});

export const action = <Schema extends z.ZodType, V, A extends AuthorizationGroup>({
	authorizationGroup = "anyone" as A,
	schema,
	action,
}: {
	authorizationGroup?: A;
	schema: Schema;
	action: (
		data: z.infer<Schema>,
		authContext: { user: A extends "anyone" ? User | null : A extends "anonymous" ? null : User },
	) => Promise<V>;
}): ((data: z.infer<Schema>) => Promise<V | ActionResponse>) => {
	return async (data) => {
		const user = await useAuth().catch(() => null);

		if (!isAuthorized(user, authorizationGroup)) return { type: "user_error", message: "Unauthorized" };

		const validation = schema.safeParse(data);

		if (!validation.success) return { type: "user_error", message: validation.error.issues[0].message };

		try {
			return await action(validation.data, { user } as {
				user: A extends "anyone" ? User | null : A extends "anonymous" ? null : User;
			});
		} catch (error) {
			console.error(error);
			if (error instanceof UserError) return { type: "user_error", message: error.message };
			else return { type: "server_error", message: error instanceof Error ? error.message : "Unknown error" };
		}
	};
};
