import type { Insight } from '@/components/admin/types';

// Extended type with fields the API returns beyond the base Insight
export interface InsightFull extends Insight {
  excerpt?: string;
  image?: string;
  author?: string;
  date?: string;
  updated_at?: string;
  tags?: string[];
}

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

export async function fetchInsightById(id: string): Promise<InsightFull | null> {
  const insights = await fetchInsights();
  return (insights.find((i) => i.id === id) as InsightFull | undefined) || null;
}

export async function fetchRelatedInsights(category: string, excludeId: string): Promise<InsightFull[]> {
  const insights = await fetchInsights();
  const sameCategory = insights.filter((i) => i.id !== excludeId && i.category === category).slice(0, 3);
  if (sameCategory.length < 3) {
    const others = insights
      .filter((i) => i.id !== excludeId && i.category !== category && !sameCategory.some((r) => r.id === i.id))
      .slice(0, 3 - sameCategory.length);
    sameCategory.push(...others);
  }
  return sameCategory;
}
