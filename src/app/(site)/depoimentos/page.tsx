import type { Metadata } from 'next';
import { Testimonials } from '@/components/Testimonials';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Depoimentos',
  description: 'O que dizem os nossos clientes e investidores sobre a HABTA',
  alternates: {
    canonical: 'https://habta.eu/depoimentos',
  },
  openGraph: {
    title: 'Depoimentos',
    description: 'O que dizem os nossos clientes e investidores sobre a HABTA',
    url: 'https://habta.eu/depoimentos',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function DepoimentosPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Testimonials />
    </Section>
  );
}
