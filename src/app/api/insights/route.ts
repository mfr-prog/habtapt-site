import { NextResponse } from "next/server";


export async function GET() {
	// Stub data; replace with Supabase query if needed
	return NextResponse.json({
		insights: [
			{ id: "1", title: "Insight 1", summary: "Resumo do insight 1." },
			{ id: "2", title: "Insight 2", summary: "Resumo do insight 2." },
		],
	});
}


