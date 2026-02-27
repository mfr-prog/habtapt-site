import type { Metadata } from 'next';
import { Testimonials } from '@/components/Testimonials';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Depoimentos de Clientes e Investidores',
  description: 'Depoimentos reais de clientes e investidores sobre a HABTA. Descubra a experiência de quem já investiu em reabilitação urbana e imóveis premium em Portugal.',
  alternates: {
    canonical: 'https://habta.eu/depoimentos',
  },
  openGraph: {
    title: 'Depoimentos de Clientes e Investidores — HABTA',
    description: 'Depoimentos reais de clientes e investidores sobre a HABTA. Descubra a experiência de quem já investiu em imóveis premium em Portugal.',
    url: 'https://habta.eu/depoimentos',
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
    { '@type': 'ListItem', position: 2, name: 'Depoimentos', item: 'https://habta.eu/depoimentos' },
  ],
};

export default function DepoimentosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Section background="white" style={{ paddingTop: '7.5rem' }}>
        <Testimonials />
      </Section>
    </>
  );
}
