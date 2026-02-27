import type { Metadata } from 'next';
import { Contact } from '@/components/Contact';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Entre em contacto com a HABTA para discutir o seu projeto imobiliario',
  alternates: {
    canonical: 'https://habta.eu/contacto',
  },
  openGraph: {
    title: 'Contacto',
    description: 'Entre em contacto com a HABTA para discutir o seu projeto imobiliario',
    url: 'https://habta.eu/contacto',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function ContactoPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Contact />
    </Section>
  );
}
