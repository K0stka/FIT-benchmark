"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { FileUpload } from "./FileUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSolution } from "@/actions/benchmark/submit";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";

export function SubmitSolutionForm({ benchmarkId }: { benchmarkId: number }) {
	const [fileId, setFileId] = useState<number | null>(null);
	const { action: execute, pending } = useAction(submitSolution);

	async function handleSubmit() {
		if (!fileId) {
			toast.error("Please upload a file first.");
			return;
		}

		const result = await execute({
			benchmarkId,
			fileId,
		});

		if (result?.result === "success") {
			setFileId(null);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Submit Solution</CardTitle>
				<CardDescription>Upload your C source code.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label>Source Code (.c)</Label>
					<FileUpload
						onUpload={(id) => setFileId(id)}
						onRemove={() => setFileId(null)}
						value={fileId ? [{ fileId, filename: "source.c" }] : []}
					/>
				</div>
				<Button
					onClick={handleSubmit}
					disabled={!fileId || pending}>
					{pending ? "Submitting..." : "Submit"}
				</Button>
			</CardContent>
		</Card>
	);
}
