import * as schema from "./schema";

import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env";

// import { Pool } from "pg";

// const pool = new Pool({
// 	connectionString: env.DATABASE_URL,
// 	max: env.NODE_ENV === "production" ? 50 : 10,
// 	min: env.NODE_ENV === "production" ? 10 : 2,
// 	idleTimeoutMillis: 60000,
// 	connectionTimeoutMillis: 5000,
// });

// pool.on("error", (err) => console.error("Database pool error:", err));

export const db = drizzle(env.DATABASE_URL, {
	schema,
});

export * from "drizzle-orm";

export * from "./models";
