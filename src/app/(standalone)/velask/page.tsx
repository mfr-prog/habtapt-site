import type { Metadata } from 'next';
import VelaskPageClient from './_components/VelaskPageClient';

export const metadata: Metadata = {
  title: 'VELASK Residence — Apartamentos T1 a T3 Duplex em Campanhã, Porto',
  description: 'VELASK Residence: apartamentos T1 a T3 Duplex de 106 a 118 m² em Campanhã, Porto. Reabilitação premium com entrega em abril de 2026. Acabamentos de luxo e localização estratégica.',
  alternates: {
    canonical: 'https://habta.eu/velask',
  },
  openGraph: {
    title: 'VELASK Residence — Apartamentos Premium em Campanhã, Porto',
    description: 'Apartamentos T1 a T3 Duplex de 106 a 118 m² em Campanhã, Porto. Reabilitação premium com entrega em abril de 2026.',
    url: 'https://habta.eu/velask',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VELASK Residence — Apartamentos Premium em Porto',
    description: 'Apartamentos T1 a T3 Duplex em Campanhã, Porto. Entrega abril 2026.',
  },
};

export default function VelaskPage() {
  return <VelaskPageClient />;
}
