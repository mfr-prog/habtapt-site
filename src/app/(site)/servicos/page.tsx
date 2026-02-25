import type { Metadata } from 'next';
import ServicosContent from './_components/ServicosContent';

export const metadata: Metadata = {
  title: 'Servicos',
  description: 'Servicos de compra estrategica, reforma inteligente e venda otimizada pela HABTA',
};

export default function Page() {
  return <ServicosContent />;
}
