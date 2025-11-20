import { z } from "zod";

export const submitSolutionSchema = z.object({
	benchmarkId: z.number(),
	fileId: z.number(),
});

export type SubmitSolutionInput = z.infer<typeof submitSolutionSchema>;
