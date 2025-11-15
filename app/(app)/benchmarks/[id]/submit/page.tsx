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
				<h1 className="text-3xl font-bold">Odeslat své řešení</h1>
				<p className="text-muted-foreground mt-2">
					Nahrajte svůj zdrojový kód, který bude testován a benchmarkován.
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Zdrojový kód</CardTitle>
							<CardDescription>
								Nahrajte soubor s implementací nebo vložte kód přímo.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<label
									htmlFor="file-upload"
									className="hover:bg-muted/50 border-input flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-sm font-medium transition-colors">
									<Upload className="h-5 w-5" />
									Klikněte pro nahrání souboru
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
										<FormLabel>Název souboru</FormLabel>
										<FormControl>
											<Input placeholder="např. solution.c" {...field} />
										</FormControl>
										<FormDescription>Název vašeho zdrojového souboru</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="sourceCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Zdrojový kód</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Vložte svůj kód sem nebo nahrajte soubor výše..."
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
							Zrušit
						</Button>
						<PendingButton pending={pending} type="submit">
							<Upload className="mr-2 h-4 w-4" />
							Odeslat řešení
						</PendingButton>
					</div>
				</form>
			</Form>
		</div>
	);
}
