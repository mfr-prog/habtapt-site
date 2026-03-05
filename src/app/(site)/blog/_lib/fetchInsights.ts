import type { Insight } from '@/components/admin/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_ID || 'xrgcrvhmzoxfduhytzhk'}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export async function fetchInsights(): Promise<Insight[]> {
  try {
    const url = `${SUPABASE_URL}/functions/v1/make-server-4b2936bc/insights`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`[fetchInsights] Server returned ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.insights) && data.insights.length > 0) {
      return data.insights as Insight[];
    }

    return [];
  } catch (error) {
    console.error('[fetchInsights] Error:', error);
    return [];
  }
}
