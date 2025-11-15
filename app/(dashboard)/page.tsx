import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NextPage } from "next";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

const Page: NextPage = async () => {
	const auth = await useAuth().catch(() => null);

	return (
		<div>
			Auth status:
			<pre>{JSON.stringify(auth, null, 2)}</pre>
			<br />
			<Link href="/login">
				<Button>Login</Button>
			</Link>
			<form
				action={async () => {
					"use server";

					await signOut();
				}}>
				<Button
					type="submit"
					variant="destructive">
					Logout
				</Button>
			</form>
		</div>
	);
};

export default Page;
