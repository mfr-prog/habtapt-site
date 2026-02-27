import type { Metadata } from 'next';
import { Insights } from '@/components/Insights';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Insights — Artigos sobre Investimento Imobiliário e Reabilitação',
  description: 'Artigos especializados sobre investimento imobiliário, reabilitação urbana, regulamentação e mercado imobiliário em Portugal. Dicas e análises para investidores.',
  alternates: {
    canonical: 'https://habta.eu/blog',
  },
  openGraph: {
    title: 'Insights sobre Investimento Imobiliário — HABTA',
    description: 'Artigos especializados sobre investimento imobiliário, reabilitação urbana e mercado imobiliário em Portugal.',
    url: 'https://habta.eu/blog',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://habta.eu' },
    { '@type': 'ListItem', position: 2, name: 'Insights', item: 'https://habta.eu/blog' },
  ],
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Section background="white" style={{ paddingTop: '7.5rem' }}>
        <Insights />
      </Section>
    </>
  );
}
