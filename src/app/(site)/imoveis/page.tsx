import type { Metadata } from 'next';
import { Suspense } from 'react';
import ImoveisContent from './_components/ImoveisContent';

export const metadata: Metadata = {
  title: 'Imóveis à Venda em Portugal — Apartamentos e Moradias Reabilitados',
  description: 'Descubra imóveis reabilitados premium à venda em Portugal. Apartamentos e moradias em Lisboa, Porto e Cascais para morar ou investir, com acabamentos de alta qualidade.',
  keywords: ['imóveis portugal', 'apartamentos lisboa', 'apartamentos porto', 'moradias cascais', 'investimento imobiliário', 'reabilitação urbana', 'imóveis reabilitados'],
  alternates: {
    canonical: 'https://habta.eu/imoveis',
  },
  openGraph: {
    title: 'Imóveis à Venda em Portugal — HABTA',
    description: 'Imóveis reabilitados premium à venda em Portugal. Apartamentos e moradias para morar ou investir, com acabamentos de alta qualidade.',
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

export default function ImoveisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Suspense>
        <ImoveisContent />
      </Suspense>
    </>
  );
}
