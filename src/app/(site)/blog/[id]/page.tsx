import type { Metadata } from 'next';
import InsightDetailContent from './_components/InsightDetailContent';

export const runtime = 'edge';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Insight ${id}`,
    description: 'Artigo sobre investimento imobiliario e reabilitacao urbana pela HABTA',
  };
}

export default function Page() {
  return <InsightDetailContent />;
}
