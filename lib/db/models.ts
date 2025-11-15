import { LOG_TYPES, USER_TYPES, User } from "../types";
import { index, integer, jsonb, pgEnum, pgTable, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

export const UserType = pgEnum("user_type", USER_TYPES);

export const Users = pgTable(
	"users",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		nickname: varchar("nickname", { length: 31 }).notNull(),
		passwordHash: varchar("password_hash", { length: 255 }).notNull(),
		colors: jsonb("colors").notNull().$type<User["colors"]>(),
		type: UserType("type").notNull().default("user"),
	},
	(table) => [uniqueIndex("users_nickname_key").on(table.nickname)]
);

export const LogTypes = pgEnum("log_type", LOG_TYPES);

export const Logs = pgTable(
	"logs",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		type: LogTypes("type").notNull(),
		timestamp: timestamp("timestamp", { mode: "date" }).notNull(),
		userId: integer("user_id").references(() => Users.id),
		data: jsonb("data").$type<Record<string, any>>().default({}).notNull(),
	},
	(table) => [index("logs_user_id_key").on(table.userId), index("logs_type_key").on(table.type)]
);

export const Flags = pgTable("flags", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	value: jsonb("value").$type<Record<string, any>>().notNull().default({}),
});
