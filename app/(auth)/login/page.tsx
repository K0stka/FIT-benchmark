"use client";

import { AlertCircle, LogIn, UserPlus } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import Link from "next/link";
import { PendingButton } from "@/components/async/AsyncButton";
import { Separator } from "@/components/ui/separator";
import { loginSchema } from "@/lib/schema/auth";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LoginError = () => {
	const code = useSearchParams().get("code");

	let message: string | null = null;
	switch (code) {
		case "credentials":
			message = "Neplatné přihlašovací údaje";
			break;
		case null:
			return null;
		default:
			message = "Během přihlašování došlo k neznámé chybě";
	}

	return (
		<div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm">
			<AlertCircle className="h-4 w-4 shrink-0" />
			<span>{message}</span>
		</div>
	);
};

export default function Login() {
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<loginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			nickname: "",
			password: "",
		},
	});

	const onSubmit = (values: loginSchema) => {
		setIsSubmitting(true);
		signIn("credentials", values).finally(() => setIsSubmitting(false));
	};

	return (
		<>
			<CardHeader>
				<CardTitle className="text-2xl">Vítejte zpět</CardTitle>
			</CardHeader>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<CardContent className="flex flex-col gap-6">
						<Suspense>
							<LoginError />
						</Suspense>
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
											autoComplete="current-password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<PendingButton
							type="submit"
							pending={isSubmitting}
							className="w-full">
							<LogIn className="mr-2 h-4 w-4" />
							Přihlásit se
						</PendingButton>
						<div className="text-muted-foreground relative text-center text-sm">
							<div className="bg-border absolute inset-x-0 top-1/2 h-px" />
							<span className="bg-card relative px-4">Nemáte účet?</span>
						</div>
						<Link
							href="/register"
							className="hover:bg-muted/50 border-input flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors">
							<UserPlus className="h-4 w-4" />
							Zaregistrujte se
						</Link>
					</CardContent>
				</form>
			</Form>
		</>
	);
}
