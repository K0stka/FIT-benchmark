import { z } from "zod";

export const benchmarkStepSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	order: z.number().int(),
	commandPreview: z.string().min(1, "Command preview is required"),
	commandTemplate: z.string().min(1, "Command template is required"),
	timeoutSeconds: z.number().int().positive(),
	assets: z
		.array(
			z.object({
				fileId: z.number(),
				filename: z.string(),
			})
		)
		.optional(),
});

export const testCaseSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	order: z.number().int(),
	testCommandPreview: z.string().min(1, "Command preview is required"),
	testCommandTemplate: z.string().min(1, "Command template is required"),
	timeoutSeconds: z.number().int().positive(),
	input: z.string().optional(),
	expectedOutput: z.string().optional(),
	assets: z
		.array(
			z.object({
				fileId: z.number(),
				filename: z.string(),
			})
		)
		.optional(),
});

export const createBenchmarkSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	buildCommandPreview: z.string().min(1, "Build command preview is required"),
	buildCommandTemplate: z.string().min(1, "Build command template is required"),
	buildDebugCommandTemplate: z.string().min(1, "Debug build command template is required"),
	scoreCalculationDescription: z.string().min(1, "Score calculation description is required"),
	steps: z.array(benchmarkStepSchema).optional(),
	testCases: z.array(testCaseSchema).optional(),
});

export type CreateBenchmarkInput = z.infer<typeof createBenchmarkSchema>;
