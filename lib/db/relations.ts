import { Logs, Users } from "./models";

import { relations } from "drizzle-orm";

export const userRelations = relations(Users, ({ many }) => ({
	logs: many(Logs),
}));

export const logRelations = relations(Logs, ({ one }) => ({
	user: one(Users, { fields: [Logs.userId], references: [Users.id] }),
}));
