import AuthContextProvider from "@/lib/auth/context";
import { NextLayout } from "@/lib/utilityTypes";
import { useAuth } from "@/hooks/useAuth";
import { TopBar } from "@/components/layout/TopBar";

const Layout: NextLayout = async ({ children }) => {
	const user = await useAuth();

	return (
		<AuthContextProvider user={user}>
			<div className="min-h-screen flex flex-col">
				<TopBar />
				<main className="flex-1 container mx-auto py-6">{children}</main>
			</div>
		</AuthContextProvider>
	);
};

export default Layout;
