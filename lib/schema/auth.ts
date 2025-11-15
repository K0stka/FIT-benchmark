import { nicknameSchema } from "./user";
import z from "zod";

const passwordSchema = z
	.string()
	.min(8, "Heslo musí mít alespoň 8 znaků")
	.regex(/\d/, "Heslo musí obsahovat alespoň jednu číslici")
	.regex(/\p{Ll}/u, "Heslo musí obsahovat alespoň jedno malé písmeno")
	.regex(/\p{Lu}/u, "Heslo musí obsahovat alespoň jedno velké písmeno");

export const loginSchema = z.object({
	nickname: nicknameSchema,
	password: z.string().min(1, "Heslo je povinné"),
});

export type loginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	nickname: nicknameSchema,
	password: passwordSchema,
});

export type registerSchema = z.infer<typeof registerSchema>;
