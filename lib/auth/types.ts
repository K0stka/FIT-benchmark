import { DefaultUser } from "@auth/core/types";
import { User as UserType } from "../types";

declare module "next-auth" {
	interface User extends DefaultUser {
		id: UserType["id"];
		type: UserType["type"];
	}
}
