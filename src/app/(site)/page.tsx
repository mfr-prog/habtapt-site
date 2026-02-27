import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { CredibilityBar } from '@/components/CredibilityBar';
import { DualCTA } from '@/components/DualCTA';
import { Contact } from '@/components/Contact';

export const metadata: Metadata = {
  description: 'HABTA - Imóveis reabilitados premium em Portugal. Reabilitação urbana e investimento imobiliário de alto rendimento.',
  alternates: {
    canonical: 'https://habta.eu',
  },
  openGraph: {
    title: 'HABTA',
    description: 'HABTA - Imóveis reabilitados premium em Portugal. Reabilitação urbana e investimento imobiliário de alto rendimento.',
    url: 'https://habta.eu',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Portfolio variant="homepage" />
      <CredibilityBar />
      <DualCTA />
      <Contact />
    </>
  );
}
