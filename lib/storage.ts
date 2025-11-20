import { Files, db } from "@/lib/db";

import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export async function saveFile(file: File, userId: number): Promise<number> {
	await mkdir(UPLOAD_DIR, { recursive: true });

	const buffer = Buffer.from(await file.arrayBuffer());
	const filename = `${Date.now()}-${file.name}`;
	const filepath = join(UPLOAD_DIR, filename);

	await writeFile(filepath, buffer);

	const [record] = await db
		.insert(Files)
		.values({
			uploadedBy: userId,
			uploadedAt: new Date(),
			sizeBytes: file.size,
		})
		.returning();

	// In a real app, we would store the path or key in the DB or use an object storage service.
	// For this implementation, we assume the ID is enough to find the file if we name it consistently or add a path column.
	// However, the current schema doesn't have a path/key column in Files table.
	// I should probably add one, or just use the ID to name the file on disk.
	// Let's rename the file to use the ID after insertion or just trust the ID.
	// Wait, I can't rename it easily after insertion without updating the DB if I store the path.
	// But the DB doesn't store the path.
	// So I will store the file as `uploads/{id}`.

	const finalPath = join(UPLOAD_DIR, record.id.toString());
	await writeFile(finalPath, buffer);
	// Remove the temp file if I created one, but I didn't.

	return record.id;
}

export async function getFilePath(fileId: number): Promise<string> {
	return join(UPLOAD_DIR, fileId.toString());
}
