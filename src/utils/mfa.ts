import { SupabaseClient } from '@supabase/supabase-js';

export async function getAssuranceLevel(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) return { currentLevel: 'aal1' as const, nextLevel: null };
  return data;
}

export async function checkMfaEnrolled(supabase: SupabaseClient) {
  const { data } = await supabase.auth.mfa.listFactors();
  return (data?.totp?.length ?? 0) > 0;
}
