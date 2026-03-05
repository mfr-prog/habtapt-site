import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabaseServer";

export const runtime = 'edge';

export async function GET() {
	try {
		const supabase = getSupabaseServiceClient();
		const { data, error } = await supabase
			.from("projects")
			.select("*")
			.order("created_at", { ascending: false });

		if (error) {
			return NextResponse.json({ success: false, error: error.message }, { status: 500 });
		}

		return NextResponse.json({ success: true, projects: data });
	} catch (err) {
		console.error("[API /projects] Error:", err);
		return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
	}
}
