"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { benchmarkSchema, BenchmarkSchema } from "@/lib/schema/benchmarks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PendingButton } from "@/components/async/AsyncButton";

type BenchmarkFormProps = {
	initialData?: BenchmarkSchema;
	onSubmit: (data: BenchmarkSchema) => Promise<void>;
	pending: boolean;
	submitLabel: string;
};

export function BenchmarkForm({ initialData, onSubmit, pending, submitLabel }: BenchmarkFormProps) {
	const form = useForm<BenchmarkSchema>({
		resolver: zodResolver(benchmarkSchema),
		defaultValues: initialData || {
			name: "",
			description: "",
			buildCommandPreview: "",
			buildCommandTemplate: "",
			buildDebugCommandTemplate: "",
			scoreCalculationDescription: "",
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Základní informace</CardTitle>
						<CardDescription>Obecné údaje o benchmarku</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Název</FormLabel>
									<FormControl>
										<Input placeholder="např. Násobení matic" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Popis</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Popište, co tento benchmark testuje..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Konfigurace sestavení</CardTitle>
						<CardDescription>Příkazy používané pro kompilaci odeslaného kódu</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="buildCommandPreview"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Náhled příkazu pro sestavení</FormLabel>
									<FormControl>
										<Input placeholder="např. gcc -O2 -o solution solution.c" {...field} />
									</FormControl>
									<FormDescription>Čitelný náhled příkazu pro sestavení</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="buildCommandTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Šablona příkazu pro sestavení</FormLabel>
									<FormControl>
										<Textarea
											placeholder="např. gcc -O2 -o {{OUTPUT}} {{SOURCE}}"
											{...field}
										/>
									</FormControl>
									<FormDescription>Šablona s proměnnými pro skutečný příkaz pro sestavení</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="buildDebugCommandTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Šablona příkazu pro sestavení s debugováním</FormLabel>
									<FormControl>
										<Textarea
											placeholder="např. gcc -g -o {{OUTPUT}} {{SOURCE}}"
											{...field}
										/>
									</FormControl>
									<FormDescription>Šablona pro sestavení s debug symboly</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Hodnocení</CardTitle>
						<CardDescription>Jak jsou výsledky benchmarku hodnoceny</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="scoreCalculationDescription"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Popis výpočtu skóre</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Popište, jak se skóre vypočítává z výsledků benchmarku..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={() => window.history.back()}>
						Zrušit
					</Button>
					<PendingButton pending={pending} type="submit">
						{submitLabel}
					</PendingButton>
				</div>
			</form>
		</Form>
	);
}
