import "server-only";

import { z } from "zod";

export const env = z
	.object({
		NODE_ENV: z.enum(["development", "production"]),

		AUTH_URL: z.string().readonly(),
		AUTH_SECRET: z.string().readonly(),

		DATABASE_URL: z.string().readonly(),

		UPLOAD_PATH: z.string().readonly(),
	})
	.parse(process.env);
