import type { Metadata } from 'next';
import ServicosContent from './_components/ServicosContent';

export const metadata: Metadata = {
  title: 'Servicos',
  description: 'Servicos de compra estrategica, reforma inteligente e venda otimizada pela HABTA',
  alternates: {
    canonical: 'https://habta.eu/servicos',
  },
  openGraph: {
    title: 'Servicos',
    description: 'Servicos de compra estrategica, reforma inteligente e venda otimizada pela HABTA',
    url: 'https://habta.eu/servicos',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function Page() {
  return <ServicosContent />;
}
