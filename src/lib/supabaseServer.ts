import { createClient } from "@supabase/supabase-js";

export function getSupabaseServiceClient() {
	// These must be configured in your env (Cloudflare Pages project vars or .env.local)
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!supabaseUrl || !supabaseServiceKey) {
		throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
	}

	return createClient(supabaseUrl, supabaseServiceKey, {
		auth: { persistSession: false, autoRefreshToken: false },
		global: { fetch: fetch as any },
	});
}



