import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Files } from "@/lib/db/models";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request: NextRequest) {
	const session = await auth();
	if (!session?.user?.id) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get("file") as File;

	if (!file) {
		return new NextResponse("No file uploaded", { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const filename = file.name;
	const sizeBytes = file.size;

	// Insert into DB to get ID
	const [fileRecord] = await db
		.insert(Files)
		.values({
			uploadedAt: new Date(),
			uploadedBy: Number(session.user.id),
			sizeBytes: sizeBytes,
		})
		.returning();

	// Save to disk
	// We use the ID as the filename to avoid collisions and for easy retrieval
	const safeFilename = fileRecord.id.toString();
	const uploadDir = path.join(process.cwd(), "uploads");
	const filePath = path.join(uploadDir, safeFilename);

	await writeFile(filePath, buffer);

	return NextResponse.json({
		id: fileRecord.id,
		filename: filename,
	});
}
