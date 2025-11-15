import z from "zod";

export const benchmarkSchema = z.object({
	name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
	description: z.string().min(1, "Description is required"),
	buildCommandPreview: z.string().min(1, "Build command preview is required"),
	buildCommandTemplate: z.string().min(1, "Build command template is required"),
	buildDebugCommandTemplate: z.string().min(1, "Build debug command template is required"),
	scoreCalculationDescription: z.string().min(1, "Score calculation description is required"),
});

export type BenchmarkSchema = z.infer<typeof benchmarkSchema>;

export const testCaseSchema = z.object({
	benchmarkId: z.number().int().positive(),
	name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
	description: z.string().min(1, "Description is required"),
	order: z.number().int().nonnegative(),
	testCommandPreview: z.string().min(1, "Test command preview is required"),
	testCommandTemplate: z.string().min(1, "Test command template is required"),
	timeoutSeconds: z.number().int().positive().max(3600, "Timeout must be at most 3600 seconds (1 hour)"),
});

export type TestCaseSchema = z.infer<typeof testCaseSchema>;

export const benchmarkStepSchema = z.object({
	benchmarkId: z.number().int().positive(),
	name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
	description: z.string().min(1, "Description is required"),
	order: z.number().int().nonnegative(),
	commandPreview: z.string().min(1, "Command preview is required"),
	commandTemplate: z.string().min(1, "Command template is required"),
	timeoutSeconds: z.number().int().positive().max(3600, "Timeout must be at most 3600 seconds (1 hour)"),
});

export type BenchmarkStepSchema = z.infer<typeof benchmarkStepSchema>;

export const benchmarkIdSchema = z.object({
	id: z.number().int().positive(),
});

export type BenchmarkIdSchema = z.infer<typeof benchmarkIdSchema>;

export const submitSolutionSchema = z.object({
	benchmarkId: z.number().int().positive(),
	sourceCode: z.string().min(1, "Source code is required"),
	filename: z.string().min(1, "Filename is required").max(255, "Filename must be at most 255 characters"),
});

export type SubmitSolutionSchema = z.infer<typeof submitSolutionSchema>;
