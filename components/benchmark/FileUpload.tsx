"use client";

import { ChangeEvent, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FileUploadProps {
	onUpload: (fileId: number, filename: string) => void;
	onRemove?: (fileId: number) => void;
	value?: { fileId: number; filename: string }[];
}

export function FileUpload({ onUpload, onRemove, value = [] }: FileUploadProps) {
	const [uploading, setUploading] = useState(false);

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);

		try {
			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				throw new Error("Upload failed");
			}

			const data = await res.json();
			onUpload(data.id, data.filename);
			toast.success("File uploaded successfully");
		} catch (error) {
			console.error(error);
			toast.error("Failed to upload file");
		} finally {
			setUploading(false);
			// Reset input
			e.target.value = "";
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2">
				<Input
					type="file"
					onChange={handleFileChange}
					disabled={uploading}
					className="max-w-xs"
				/>
				{uploading && <Loader2 className="h-4 w-4 animate-spin" />}
			</div>
			{value.length > 0 && (
				<div className="space-y-1">
					{value.map((file) => (
						<div
							key={file.fileId}
							className="flex items-center justify-between p-2 border rounded text-sm">
							<span className="truncate">{file.filename}</span>
							{onRemove && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="h-6 w-6 text-destructive"
									onClick={() => onRemove(file.fileId)}>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
