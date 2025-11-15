import AuthContextProvider from "@/lib/auth/context";
import { NextLayout } from "@/lib/utilityTypes";
import { useAuth } from "@/hooks/useAuth";

const Layout: NextLayout = async ({ children }) => {
	const user = await useAuth();

	return <AuthContextProvider user={user}>{children}</AuthContextProvider>;
};

export default Layout;
