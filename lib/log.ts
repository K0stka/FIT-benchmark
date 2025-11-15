import { Logs, db } from "./db";

import { Log } from "./types";
import { after } from "next/server";

export const logEvent = (event: Pick<Log, "type" | "userId" | "data">) => {
	after(async () => {
		await db.insert(Logs).values({
			...event,
			timestamp: new Date(),
		});
	});
};
