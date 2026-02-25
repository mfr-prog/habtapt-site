import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apartamentos T1 T2 T3 para Venda Porto Campanhã — Reabilitados 2026 | Velask by HABTA',
  description:
    'Velask — 3 apartamentos T1, T2 e T3 Duplex totalmente reabilitados em Campanhã, Porto. Cozinha equipada, entrega em 60 dias. Every home, productized. habta.eu',
  keywords: [
    'apartamento porto',
    'T1 porto',
    'T2 porto',
    'T3 duplex porto',
    'campanhã porto',
    'campanha porto',
    'imóvel novo porto',
    'velask',
    'habta',
    'reabilitação urbana porto',
    'apartamento jardim porto',
    'duplex porto',
  ],
  openGraph: {
    title: 'Velask — Apartamentos Novos em Campanhã, Porto | HABTA',
    description:
      '3 apartamentos T1, T2 e T3 Duplex totalmente reabilitados. Cozinha equipada. Entrega em 60 dias. Porto, Campanhã.',
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
              'Três apartamentos a estrear com jardins privados e duplex em Campanhã, Porto. Reabilitação total 2026.',
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
