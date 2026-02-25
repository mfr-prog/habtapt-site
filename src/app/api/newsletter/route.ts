import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabaseServer";

export const runtime = 'edge';


type NewsletterBody = {
	email?: string;
	name?: string;
};

export async function POST(request: Request) {
	try {
		const { email, name }: NewsletterBody = await request.json().catch(() => ({}));
		if (!email) {
			return NextResponse.json({ error: "Email é obrigatório." }, { status: 400 });
		}

		const supabase = getSupabaseServiceClient();
		const { error } = await supabase.from("newsletter_subscribers").insert({
			email,
			name: name ?? null,
			subscribed_at: new Date().toISOString(),
		});

		if (error) {
			return NextResponse.json({ error: error.message }, { status: 400 });
		}

		return NextResponse.json({ ok: true });
	} catch (err) {
		return NextResponse.json({ error: "Erro inesperado ao assinar newsletter." }, { status: 500 });
	}
}


