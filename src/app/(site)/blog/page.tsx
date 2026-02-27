import type { Metadata } from 'next';
import { Insights } from '@/components/Insights';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Artigos sobre investimento imobiliario, regulamentacao e sustentabilidade',
  alternates: {
    canonical: 'https://habta.eu/blog',
  },
  openGraph: {
    title: 'Insights',
    description: 'Artigos sobre investimento imobiliario, regulamentacao e sustentabilidade',
    url: 'https://habta.eu/blog',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function BlogPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Insights />
    </Section>
  );
}
