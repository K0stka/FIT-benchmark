import "dotenv/config";

import { defineConfig } from "drizzle-kit";
import { env } from "process";

export default defineConfig({
	out: "./lib/db/",
	schema: "./lib/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL!,
	},
});
