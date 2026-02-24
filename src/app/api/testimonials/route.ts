import { NextResponse } from "next/server";


export async function GET() {
	return NextResponse.json({
		testimonials: [
			{ id: "1", name: "Cliente A", text: "Excelente!" },
			{ id: "2", name: "Cliente B", text: "Recomendo muito." },
		],
	});
}


