import { USER_TYPES, User } from "../types";

export type AuthorizationGroup = (typeof USER_TYPES)[number] | "anyone" | "anonymous";

export const isAuthorized = (user: Pick<User, "type"> | undefined | null, group: AuthorizationGroup) => {
	if (group === "anonymous") return !user;

	if (group === "anyone") return true;

	if (!user) return false;

	switch (group) {
		case "admin":
			return user.type === "admin";
		case "user":
			return true;

		default:
			throw new Error(`Unknown authorization group: ${group}`);
	}
};
