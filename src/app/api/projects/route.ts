import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
	return NextResponse.json({
		projects: [
			{ id: "p1", name: "Projeto Um", url: "https://example.com/um" },
			{ id: "p2", name: "Projeto Dois", url: "https://example.com/dois" },
		],
	});
}


