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
						<CardTitle>Basic Information</CardTitle>
						<CardDescription>General details about the benchmark</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="e.g., Matrix Multiplication" {...field} />
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
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe what this benchmark tests..."
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
						<CardTitle>Build Configuration</CardTitle>
						<CardDescription>Commands used to compile the submitted code</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="buildCommandPreview"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Build Command Preview</FormLabel>
									<FormControl>
										<Input placeholder="e.g., gcc -O2 -o solution solution.c" {...field} />
									</FormControl>
									<FormDescription>A human-readable preview of the build command</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="buildCommandTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Build Command Template</FormLabel>
									<FormControl>
										<Textarea
											placeholder="e.g., gcc -O2 -o {{OUTPUT}} {{SOURCE}}"
											{...field}
										/>
									</FormControl>
									<FormDescription>Template with placeholders for the actual build command</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="buildDebugCommandTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Build Debug Command Template</FormLabel>
									<FormControl>
										<Textarea
											placeholder="e.g., gcc -g -o {{OUTPUT}} {{SOURCE}}"
											{...field}
										/>
									</FormControl>
									<FormDescription>Template for building with debug symbols</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Scoring</CardTitle>
						<CardDescription>How the benchmark results are scored</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="scoreCalculationDescription"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Score Calculation Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe how the score is calculated from benchmark results..."
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
						Cancel
					</Button>
					<PendingButton pending={pending} type="submit">
						{submitLabel}
					</PendingButton>
				</div>
			</form>
		</Form>
	);
}
