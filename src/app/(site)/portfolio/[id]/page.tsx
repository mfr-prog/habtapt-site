import type { Metadata } from 'next';
import PortfolioDetailContent from './_components/PortfolioDetailContent';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Projeto ${id}`,
    description: 'Detalhes do projeto de reabilitacao HABTA',
  };
}

export default function Page() {
  return <PortfolioDetailContent />;
}
