import type { Metadata } from 'next';
import { Portfolio } from '@/components/Portfolio';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Projetos de reabilitacao urbana concluidos e em curso pela HABTA',
};

export default function PortfolioPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Portfolio />
    </Section>
  );
}
