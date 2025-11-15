import z from "zod";

export const nicknameSchema = z
	.string()
	.trim()
	.min(1, "Přezdívka je povinná")
	.max(30, "Přezdívka může mít maximálně 30 znaků");
