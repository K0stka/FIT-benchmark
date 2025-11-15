import { compare, hash } from "bcrypt";

export const hashPassword = (password: string): Promise<string> => hash(password, 12);

export const comparePassword = (password: string, hash: string): Promise<boolean> => compare(password, hash);
