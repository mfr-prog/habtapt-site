import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VELASK Residence | T1, T2 e T3 Duplex nas Antas, Porto',
  description:
    'Tres apartamentos a estrear com jardins privados e duplex com sotao. Rua Manuel Carqueja, 259 — Porto (Campanha). Conclusao Abril 2026.',
  keywords: [
    'apartamento porto',
    'T1 porto',
    'T2 porto',
    'T3 duplex porto',
    'antas porto',
    'campanha porto',
    'imovel novo porto',
    'velask residence',
    'habta',
    'reabilitacao urbana porto',
  ],
  openGraph: {
    title: 'VELASK Residence | T1, T2 e T3 Duplex nas Antas, Porto',
    description:
      'Tres apartamentos a estrear com jardins privados e duplex com sotao na zona das Antas.',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
    url: 'https://habta.eu/velask',
  },
  alternates: {
    canonical: 'https://habta.eu/velask',
  },
};

export default function VelaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            name: 'VELASK Residence',
            description:
              'Tres apartamentos a estrear com jardins privados e duplex com sotao nas Antas, Porto.',
            url: 'https://habta.eu/velask',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Rua Manuel Carqueja, 259',
              addressLocality: 'Porto',
              addressRegion: 'Porto',
              postalCode: '4300',
              addressCountry: 'PT',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 41.1635,
              longitude: -8.5955,
            },
            numberOfRooms: '1-3',
            floorSize: {
              '@type': 'QuantitativeValue',
              minValue: 106.78,
              maxValue: 118.44,
              unitCode: 'MTK',
            },
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/InStock',
              priceCurrency: 'EUR',
            },
            provider: {
              '@type': 'Organization',
              name: 'HABTA',
              url: 'https://habta.eu',
              legalName: 'Jornada Prometida LDA',
              taxID: '518493644',
            },
          }),
        }}
      />
      {children}
    </>
  );
}
