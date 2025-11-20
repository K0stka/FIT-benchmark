"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";

import { AsyncButton, PendingButton } from "@/components/async/AsyncButton";
import { Button } from "@/components/ui/button";
import { CreateBenchmarkInput } from "@/lib/schema/benchmark";
import { FileUpload } from "./FileUpload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createBenchmark } from "@/actions/benchmark/create";
import { createBenchmarkSchema } from "@/lib/schema/benchmark";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

export function CreateBenchmarkForm() {
	const router = useRouter();
	const form = useForm<CreateBenchmarkInput>({
		resolver: zodResolver(createBenchmarkSchema),
		defaultValues: {
			name: "",
			description: "",
			buildCommandPreview: "gcc -o main main.c",
			buildCommandTemplate: "gcc -o main main.c",
			buildDebugCommandTemplate: "gcc -g -o main main.c",
			scoreCalculationDescription: "Execution time in milliseconds",
			steps: [],
			testCases: [],
		},
	});

	const { action: execute, pending } = useAction(createBenchmark);

	const onSubmit = async (data: CreateBenchmarkInput) => {
		const res = await execute(data);
		if (res.result === "success") {
			router.push("/dashboard");
		}
	};

	const {
		fields: stepFields,
		append: appendStep,
		remove: removeStep,
	} = useFieldArray({
		control: form.control,
		name: "steps",
	});

	const {
		fields: testCaseFields,
		append: appendTestCase,
		remove: removeTestCase,
	} = useFieldArray({
		control: form.control,
		name: "testCases",
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8">
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
						<CardDescription>General details about the benchmark.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Matrix Multiplication"
											{...field}
										/>
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
											placeholder="Describe the problem..."
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
						<CardDescription>How the submitted code should be compiled.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<FormField
							control={form.control}
							name="buildCommandPreview"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Build Command Preview</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>Shown to the user.</FormDescription>
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
										<Input {...field} />
									</FormControl>
									<FormDescription>Executed in the container.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="buildDebugCommandTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Debug Build Command Template</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormDescription>Used for Valgrind checks.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="scoreCalculationDescription"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Score Calculation</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Benchmark Steps</CardTitle>
						<CardDescription>Steps to run (e.g., Valgrind, Performance Test).</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{stepFields.map((field, index) => (
							<div
								key={field.id}
								className="border p-4 rounded-md space-y-4">
								<div className="flex justify-between items-center">
									<h4 className="font-medium">Step {index + 1}</h4>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => removeStep(index)}>
										Remove
									</Button>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name={`steps.${index}.name`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`steps.${index}.timeoutSeconds`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Timeout (s)</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) => field.onChange(parseInt(e.target.value))}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name={`steps.${index}.description`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`steps.${index}.commandPreview`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Command Preview</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`steps.${index}.commandTemplate`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Command Template</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<input
									type="hidden"
									{...form.register(`steps.${index}.order`)}
									value={index}
								/>
								<div className="space-y-2">
									<FormLabel>Assets</FormLabel>
									<FileUpload
										value={form.watch(`steps.${index}.assets`) || []}
										onUpload={(fileId, filename) => {
											const current = form.getValues(`steps.${index}.assets`) || [];
											form.setValue(`steps.${index}.assets`, [...current, { fileId, filename }]);
										}}
										onRemove={(fileId) => {
											const current = form.getValues(`steps.${index}.assets`) || [];
											form.setValue(
												`steps.${index}.assets`,
												current.filter((a) => a.fileId !== fileId)
											);
										}}
									/>
								</div>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								appendStep({
									name: "",
									description: "",
									commandPreview: "",
									commandTemplate: "",
									timeoutSeconds: 60,
									order: stepFields.length,
								})
							}>
							Add Step
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Test Cases</CardTitle>
						<CardDescription>Inputs and expected outputs.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{testCaseFields.map((field, index) => (
							<div
								key={field.id}
								className="border p-4 rounded-md space-y-4">
								<div className="flex justify-between items-center">
									<h4 className="font-medium">Test Case {index + 1}</h4>
									<Button
										type="button"
										variant="destructive"
										size="sm"
										onClick={() => removeTestCase(index)}>
										Remove
									</Button>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name={`testCases.${index}.name`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name={`testCases.${index}.timeoutSeconds`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Timeout (s)</FormLabel>
												<FormControl>
													<Input
														type="number"
														{...field}
														onChange={(e) => field.onChange(parseInt(e.target.value))}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={form.control}
									name={`testCases.${index}.description`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`testCases.${index}.testCommandPreview`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Command Preview</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`testCases.${index}.testCommandTemplate`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Command Template</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`testCases.${index}.input`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Input (stdin)</FormLabel>
											<FormControl>
												<Textarea {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`testCases.${index}.expectedOutput`}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Expected Output (stdout)</FormLabel>
											<FormControl>
												<Textarea {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<input
									type="hidden"
									{...form.register(`testCases.${index}.order`)}
									value={index}
								/>
								<div className="space-y-2">
									<FormLabel>Assets</FormLabel>
									<FileUpload
										value={form.watch(`testCases.${index}.assets`) || []}
										onUpload={(fileId, filename) => {
											const current = form.getValues(`testCases.${index}.assets`) || [];
											form.setValue(`testCases.${index}.assets`, [
												...current,
												{ fileId, filename },
											]);
										}}
										onRemove={(fileId) => {
											const current = form.getValues(`testCases.${index}.assets`) || [];
											form.setValue(
												`testCases.${index}.assets`,
												current.filter((a) => a.fileId !== fileId)
											);
										}}
									/>
								</div>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								appendTestCase({
									name: "",
									description: "",
									testCommandPreview: "",
									testCommandTemplate: "",
									timeoutSeconds: 10,
									order: testCaseFields.length,
									input: "",
									expectedOutput: "",
								})
							}>
							Add Test Case
						</Button>
					</CardContent>
				</Card>

				<PendingButton
					type="submit"
					pending={pending}>
					Create Benchmark
				</PendingButton>
			</form>
		</Form>
	);
}
