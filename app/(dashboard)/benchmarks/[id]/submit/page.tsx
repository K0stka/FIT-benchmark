"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitSolutionAction } from "@/actions/benchmarks/submit";
import { submitSolutionSchema, SubmitSolutionSchema } from "@/lib/schema/benchmarks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";
import { PendingButton } from "@/components/async/AsyncButton";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function SubmitSolutionPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const { action: submitAction, pending } = useAction(submitSolutionAction);
	const [fileContent, setFileContent] = useState("");

	const form = useForm<SubmitSolutionSchema>({
		resolver: zodResolver(submitSolutionSchema),
		defaultValues: {
			benchmarkId: parseInt(params.id),
			sourceCode: "",
			filename: "",
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue("filename", file.name);
			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result as string;
				setFileContent(content);
				form.setValue("sourceCode", content);
			};
			reader.readAsText(file);
		}
	};

	const onSubmit = async (values: SubmitSolutionSchema) => {
		const response = await submitAction(values);
		if (response.result === "success") {
			router.push(`/benchmarks/${params.id}`);
		}
	};

	return (
		<div className="container py-10">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Submit Your Solution</h1>
				<p className="text-muted-foreground mt-2">
					Upload your source code file to be tested and benchmarked.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Source Code</CardTitle>
							<CardDescription>
								Upload your implementation file or paste the code directly.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label
									htmlFor="file-upload"
									className="hover:bg-muted/50 border-input flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm font-medium transition-colors">
									<Upload className="h-5 w-5" />
									Click to upload a file
									<input
										id="file-upload"
										type="file"
										className="hidden"
										accept=".c,.cpp,.cc,.h,.hpp,.java,.py,.js,.ts"
										onChange={handleFileChange}
									/>
								</label>
							</div>

							<FormField
								control={form.control}
								name="filename"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Filename</FormLabel>
										<FormControl>
											<Input placeholder="e.g., solution.c" {...field} />
										</FormControl>
										<FormDescription>The name of your source file</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="sourceCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Source Code</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Paste your code here or upload a file above..."
												className="font-mono min-h-[300px] text-sm"
												{...field}
												value={fileContent || field.value}
												onChange={(e) => {
													setFileContent(e.target.value);
													field.onChange(e);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</CardContent>
					</Card>

					<div className="flex justify-end gap-4">
						<Button type="button" variant="outline" onClick={() => router.back()}>
							Cancel
						</Button>
						<PendingButton pending={pending} type="submit">
							<Upload className="mr-2 h-4 w-4" />
							Submit Solution
						</PendingButton>
					</div>
				</form>
			</Form>
		</div>
	);
}
