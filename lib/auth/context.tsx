"use client";

import { createContext, use } from "react";

import { User } from "../types";

interface AuthContextProviderProps {
	user: User | null;
	children: React.ReactNode;
}

const AuthContext = createContext<User | null>(null);

const AuthContextProvider = ({ user, children }: AuthContextProviderProps) => {
	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;

export const useAuthContext = () => use(AuthContext)!;
