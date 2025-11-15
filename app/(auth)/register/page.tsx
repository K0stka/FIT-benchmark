"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PendingButton } from "@/components/async/AsyncButton";
import { register } from "@/actions/auth/register";
import { registerSchema } from "@/lib/schema/auth";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Register() {
	const { action: RegisterAction, pending } = useAction(register);

	const router = useRouter();

	const form = useForm<registerSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			nickname: "",
			password: "",
		},
	});

	const onSubmit = (values: registerSchema) =>
		RegisterAction(values).then((response) => {
			if (response.result === "success") router.push("/login");
			else if (response.result === "data")
				toast.error(response.data.error, {
					action: (
						<Button
							variant="outline"
							onClick={() => router.push("/login")}
							className="text-foreground ml-auto inline-flex items-center justify-center gap-1 font-semibold underline">
							Přihlásit se
							<LogIn className="h-4 w-4" />
						</Button>
					),
				});
		});

	return (
		<>
			<CardHeader>
				<CardTitle className="text-2xl">Vytvořte si účet</CardTitle>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="flex flex-col gap-6">
						<FormField
							control={form.control}
							name="nickname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Přezdívka</FormLabel>
									<FormControl>
										<Input
											placeholder="Vaše přezdívka"
											autoComplete="username"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Heslo</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											autoComplete="new-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<PendingButton
							pending={pending}
							type="submit"
							className="w-full">
							<UserPlus className="mr-2 h-4 w-4" />
							Zaregistrovat se
						</PendingButton>
						<div className="text-muted-foreground relative text-center text-sm">
							<div className="bg-border absolute inset-x-0 top-1/2 h-px" />
							<span className="bg-card relative px-4">Už máte účet?</span>
						</div>
						<Link
							href="/login"
							className="hover:bg-muted/50 border-input flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors">
							<LogIn className="h-4 w-4" />
							Přihlaste se
						</Link>
					</CardContent>
				</form>
			</Form>
		</>
	);
}
