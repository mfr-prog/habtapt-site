import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { Portfolio } from '@/components/Portfolio';
import { CredibilityBar } from '@/components/CredibilityBar';
import { DualCTA } from '@/components/DualCTA';
import { Contact } from '@/components/Contact';

export const metadata: Metadata = {
  description: 'HABTA - Imóveis reabilitados premium em Portugal. Reabilitação urbana e investimento imobiliário de alto rendimento.',
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
