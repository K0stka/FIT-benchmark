import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const pluralHelper = (count: number, singular: string, TwoToFive: string, Many: string) =>
	count === 1 ? singular : count >= 2 && count <= 4 ? TwoToFive : Many;

export const randomString = (length: number, charset: string) => {
	let result = "";

	for (let i = 0; i < length; i++) result += charset.charAt(Math.floor(Math.random() * charset.length));

	return result;
};
