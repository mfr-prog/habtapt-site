import type { Metadata } from 'next';
import { Suspense } from 'react';
import ImoveisContent from './_components/ImoveisContent';

export const metadata: Metadata = {
  title: 'Imóveis | HABTA',
  description: 'Descubra imóveis reabilitados premium em Portugal. Apartamentos e moradias para morar ou investir, com acabamentos de alta qualidade.',
  alternates: {
    canonical: 'https://habta.eu/imoveis',
  },
  openGraph: {
    title: 'Imóveis | HABTA',
    description: 'Descubra imóveis reabilitados premium em Portugal. Apartamentos e moradias para morar ou investir, com acabamentos de alta qualidade.',
    url: 'https://habta.eu/imoveis',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function ImoveisPage() {
  return (
    <Suspense>
      <ImoveisContent />
    </Suspense>
  );
}
