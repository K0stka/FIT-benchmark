import z from "zod";

export const benchmarkSchema = z.object({
	name: z.string().min(1, "Název je povinný").max(255, "Název může mít maximálně 255 znaků"),
	description: z.string().min(1, "Popis je povinný"),
	buildCommandPreview: z.string().min(1, "Náhled příkazu pro sestavení je povinný"),
	buildCommandTemplate: z.string().min(1, "Šablona příkazu pro sestavení je povinná"),
	buildDebugCommandTemplate: z.string().min(1, "Šablona příkazu pro sestavení s debugováním je povinná"),
	scoreCalculationDescription: z.string().min(1, "Popis výpočtu skóre je povinný"),
});

export type BenchmarkSchema = z.infer<typeof benchmarkSchema>;

export const testCaseSchema = z.object({
	benchmarkId: z.number().int().positive(),
	name: z.string().min(1, "Název je povinný").max(255, "Název může mít maximálně 255 znaků"),
	description: z.string().min(1, "Popis je povinný"),
	order: z.number().int().nonnegative(),
	testCommandPreview: z.string().min(1, "Náhled testovacího příkazu je povinný"),
	testCommandTemplate: z.string().min(1, "Šablona testovacího příkazu je povinná"),
	timeoutSeconds: z.number().int().positive().max(3600, "Timeout může být maximálně 3600 sekund (1 hodina)"),
});

export type TestCaseSchema = z.infer<typeof testCaseSchema>;

export const benchmarkStepSchema = z.object({
	benchmarkId: z.number().int().positive(),
	name: z.string().min(1, "Název je povinný").max(255, "Název může mít maximálně 255 znaků"),
	description: z.string().min(1, "Popis je povinný"),
	order: z.number().int().nonnegative(),
	commandPreview: z.string().min(1, "Náhled příkazu je povinný"),
	commandTemplate: z.string().min(1, "Šablona příkazu je povinná"),
	timeoutSeconds: z.number().int().positive().max(3600, "Timeout může být maximálně 3600 sekund (1 hodina)"),
});

export type BenchmarkStepSchema = z.infer<typeof benchmarkStepSchema>;

export const benchmarkIdSchema = z.object({
	id: z.number().int().positive(),
});

export type BenchmarkIdSchema = z.infer<typeof benchmarkIdSchema>;

export const submitSolutionSchema = z.object({
	benchmarkId: z.number().int().positive(),
	sourceCode: z.string().min(1, "Zdrojový kód je povinný"),
	filename: z.string().min(1, "Název souboru je povinný").max(255, "Název souboru může mít maximálně 255 znaků"),
});

export type SubmitSolutionSchema = z.infer<typeof submitSolutionSchema>;
