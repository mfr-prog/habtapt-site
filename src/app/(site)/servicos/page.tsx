import type { Metadata } from 'next';
import ServicosContent from './_components/ServicosContent';

export const metadata: Metadata = {
  title: 'Serviços de Reabilitação Urbana e Investimento Imobiliário',
  description: 'Serviços de compra estratégica, reforma inteligente e venda otimizada de imóveis em Portugal. Reabilitação urbana completa com gestão de obra, due diligence e marketing imobiliário.',
  alternates: {
    canonical: 'https://habta.eu/servicos',
  },
  openGraph: {
    title: 'Serviços de Reabilitação Urbana e Investimento — HABTA',
    description: 'Compra estratégica, reforma inteligente e venda otimizada. Serviço completo de reabilitação urbana e investimento imobiliário em Portugal.',
    url: 'https://habta.eu/servicos',
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
    { '@type': 'ListItem', position: 2, name: 'Serviços', item: 'https://habta.eu/servicos' },
  ],
};

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Reabilitação Urbana e Investimento Imobiliário',
  provider: { '@id': 'https://habta.eu/#organization' },
  areaServed: { '@type': 'Country', name: 'Portugal' },
  description: 'Serviço completo de compra estratégica, reforma inteligente e venda otimizada de imóveis em Portugal.',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Serviços HABTA',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Compra Estratégica',
          description: 'Seleção de imóveis com alto potencial de valorização. Análise de mercado, due diligence completa e negociação especializada.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Reforma Inteligente',
          description: 'Projetos de reabilitação com design contemporâneo, materiais de qualidade e gestão rigorosa de obra.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Venda Otimizada',
          description: 'Maximização do retorno com estratégias de marketing, home staging e precificação baseada em dados.',
        },
      },
    ],
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, serviceJsonLd]) }}
      />
      <ServicosContent />
    </>
  );
}
