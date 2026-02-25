import type { Metadata } from 'next';
import { Insights } from '@/components/Insights';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Artigos sobre investimento imobiliario, regulamentacao e sustentabilidade',
};

export default function BlogPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Insights />
    </Section>
  );
}
