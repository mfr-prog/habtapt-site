import type { Metadata } from 'next';
import InsightDetailContent from './_components/InsightDetailContent';

export const runtime = 'edge';

const SUPABASE_URL = 'https://xrgcrvhmzoxfduhytzhk.supabase.co';
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ2Nydmhtem94ZmR1aHl0emhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzQ5MDEsImV4cCI6MjA3Nzc1MDkwMX0.kuOHXFvX3s5yTDmxA4KBw_r6NDZxmsQtZRm_WDkdGUE';

async function fetchInsight(id: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/insights`, {
      headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.insights) {
      return data.insights.find((i: any) => i.id === id) || null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const insight = await fetchInsight(id);

  if (insight) {
    const title = insight.title;
    const description = insight.excerpt
      ? insight.excerpt.slice(0, 160)
      : insight.description
        ? insight.description.slice(0, 160)
        : `${insight.title} — Artigo HABTA sobre ${insight.category || 'investimento imobiliario'}`;

    return {
      title,
      description,
      alternates: { canonical: `https://habta.eu/blog/${id}` },
      openGraph: {
        title: `${title} | HABTA Insights`,
        description,
        type: 'article',
        locale: 'pt_PT',
        siteName: 'HABTA',
        url: `https://habta.eu/blog/${id}`,
        ...(insight.image ? { images: [{ url: insight.image, width: 1200, height: 630, alt: title }] } : {}),
        ...(insight.date ? { publishedTime: insight.date } : {}),
        ...(insight.author ? { authors: [insight.author] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | HABTA Insights`,
        description,
        ...(insight.image ? { images: [insight.image] } : {}),
      },
    };
  }

  return {
    title: `Insight ${id}`,
    description: 'Artigo sobre investimento imobiliario e reabilitacao urbana pela HABTA',
    alternates: { canonical: `https://habta.eu/blog/${id}` },
  };
}

export default function Page() {
  return <InsightDetailContent />;
}
