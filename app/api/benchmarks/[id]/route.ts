import { getBenchmarkById } from "@/lib/data/benchmarks";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id: idStr } = await params;
	const id = parseInt(idStr);
	
	if (isNaN(id)) {
		return NextResponse.json({ error: "Invalid benchmark ID" }, { status: 400 });
	}

	const benchmark = await getBenchmarkById(id);
	
	if (!benchmark) {
		return NextResponse.json({ error: "Benchmark not found" }, { status: 404 });
	}

	return NextResponse.json(benchmark);
}
