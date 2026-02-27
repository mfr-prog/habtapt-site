import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { CredibilityBar } from '@/components/CredibilityBar';
import { DualCTA } from '@/components/DualCTA';
import { Contact } from '@/components/Contact';

export const metadata: Metadata = {
  title: 'HABTA — Imóveis Reabilitados Premium em Portugal | Investimento Imobiliário',
  description: 'Imóveis reabilitados premium em Lisboa, Porto e Cascais. Reabilitação urbana inteligente e investimento imobiliário de alto rendimento. Apartamentos e moradias com acabamentos de luxo.',
  alternates: {
    canonical: 'https://habta.eu',
  },
  openGraph: {
    title: 'HABTA — Imóveis Reabilitados Premium em Portugal',
    description: 'Imóveis reabilitados premium em Lisboa, Porto e Cascais. Reabilitação urbana inteligente e investimento imobiliário de alto rendimento.',
    url: 'https://habta.eu',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
    images: [
      {
        url: 'https://habta.eu/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HABTA — Imóveis Reabilitados Premium em Portugal',
      },
    ],
  },
};

const homeBreadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Início',
      item: 'https://habta.eu',
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeBreadcrumbJsonLd) }}
      />
      <Hero />
      <Portfolio variant="homepage" />
      <CredibilityBar />
      <DualCTA />
      <Contact />
    </>
  );
}
