import Decimal from "decimal.js";

export const USER_TYPES = ["user", "admin"] as const;

export type User = {
	id: number;
	nickname: string;
	colors: {
		light: string;
		dark: string;
	};
	type: (typeof USER_TYPES)[number];
};

export const LOG_TYPES = ["auth.register"] as const;

export type Log = {
	id: number;
	type: (typeof LOG_TYPES)[number];
	timestamp: Date;
	userId: number | null;
	data: {
		[key: string]: any;
	};
};

export type Flag = {
	id: number;
	name: string;
	value: Record<string, any>;
};
