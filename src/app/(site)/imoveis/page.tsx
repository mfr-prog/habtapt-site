import type { Metadata } from 'next';
import { fetchProperties } from './_lib/fetchProperties';
import PropertyListContent from './_components/PropertyListContent';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Imóveis | HABTA',
  description: 'Encontre o seu imóvel ideal. Apartamentos, moradias e outros imóveis de qualidade premium em Portugal, selecionados pela HABTA.',
  alternates: {
    canonical: 'https://habta.eu/imoveis',
  },
  openGraph: {
    title: 'Imóveis | HABTA',
    description: 'Encontre o seu imóvel ideal. Apartamentos, moradias e outros imóveis premium em Portugal.',
    url: 'https://habta.eu/imoveis',
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
    { '@type': 'ListItem', position: 2, name: 'Imóveis', item: 'https://habta.eu/imoveis' },
  ],
};

export default async function ImoveisPage() {
  let properties: Awaited<ReturnType<typeof fetchProperties>> = [];
  try {
    properties = await fetchProperties();
  } catch (err) {
    console.error('[ImoveisPage] Error fetching properties:', err);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PropertyListContent properties={properties} />
    </>
  );
}
