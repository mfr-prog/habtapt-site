import type { Metadata } from 'next';
import { Portfolio } from '@/components/Portfolio';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Projetos de reabilitacao urbana concluidos e em curso pela HABTA',
  alternates: {
    canonical: 'https://habta.eu/portfolio',
  },
  openGraph: {
    title: 'Portfolio',
    description: 'Projetos de reabilitacao urbana concluidos e em curso pela HABTA',
    url: 'https://habta.eu/portfolio',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function PortfolioPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Portfolio />
    </Section>
  );
}
