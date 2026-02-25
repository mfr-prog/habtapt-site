import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VELASK | Apartamentos T1, T2 e T3 Duplex nas Antas, Porto — HABTA',
  description:
    'Reabilitação total 2026. Três apartamentos a estrear com jardins privados e duplex nas Antas, Porto. A partir de 399.000 euros. Rua Manuel Carqueja, 259.',
  keywords: [
    'apartamento porto',
    'T1 porto',
    'T2 porto',
    'T3 duplex porto',
    'antas porto',
    'campanha porto',
    'imóvel novo porto',
    'velask',
    'habta',
    'reabilitação urbana porto',
    'apartamento jardim porto',
    'duplex porto',
  ],
  openGraph: {
    title: 'VELASK | Apartamentos T1, T2 e T3 Duplex nas Antas, Porto',
    description:
      'Reabilitação total 2026. Três apartamentos a estrear com jardins privados e duplex nas Antas, Porto. A partir de 399.000 euros.',
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
            name: 'VELASK',
            description:
              'Três apartamentos a estrear com jardins privados e duplex nas Antas, Porto. Reabilitação total 2026.',
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
              '@type': 'AggregateOffer',
              lowPrice: 399000,
              highPrice: 449000,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              offerCount: 3,
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
