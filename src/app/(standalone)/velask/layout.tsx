import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apartamentos T1 T2 T3 para Venda em Campanhã, Porto — Reabilitados 2026 | Velask by HABTA',
  description:
    'Velask — 3 apartamentos T1, T2 e T3 Duplex totalmente reabilitados em Campanhã, Porto. Jardins privados, cozinha equipada, garagem. Desde 399.000€. Entrega em 60 dias.',
  keywords: [
    'apartamento porto',
    'T1 porto',
    'T2 porto',
    'T3 duplex porto',
    'campanhã porto',
    'campanha porto',
    'imóvel novo porto',
    'apartamento para venda porto',
    'apartamento reabilitado porto',
    'velask',
    'habta',
    'reabilitação urbana porto',
    'apartamento jardim porto',
    'duplex porto',
    'apartamento campanhã',
    'comprar apartamento porto',
    'imóvel reabilitado campanhã',
  ],
  openGraph: {
    title: 'Velask — Apartamentos T1 T2 T3 para Venda em Campanhã, Porto | HABTA',
    description:
      '3 apartamentos T1, T2 e T3 Duplex totalmente reabilitados em Campanhã, Porto. Jardins privados, cozinha equipada. Desde 399.000€.',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
    url: 'https://habta.eu/velask',
    images: [
      {
        url: 'https://habta.eu/images/velask/t2/1.jpeg',
        width: 1200,
        height: 630,
        alt: 'Velask — Apartamentos reabilitados em Campanhã, Porto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Velask — Apartamentos T1 T2 T3 em Campanhã, Porto',
    description: '3 apartamentos totalmente reabilitados. Desde 399.000€. Entrega em 60 dias.',
    images: ['https://habta.eu/images/velask/t2/1.jpeg'],
  },
  alternates: {
    canonical: 'https://habta.eu/velask',
  },
};

const realEstateListingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateListing',
  name: 'VELASK — Apartamentos Reabilitados em Campanhã, Porto',
  description:
    'Três apartamentos a estrear com jardins privados e duplex em Campanhã, Porto. Reabilitação total 2026. T1 com garagem, T2 com jardim e anexo, T3 Duplex.',
  url: 'https://habta.eu/velask',
  image: 'https://habta.eu/images/velask/t2/1.jpeg',
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
    '@id': 'https://habta.eu/#organization',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://habta.eu' },
    { '@type': 'ListItem', position: 2, name: 'Imóveis', item: 'https://habta.eu/imoveis' },
    { '@type': 'ListItem', position: 3, name: 'Velask', item: 'https://habta.eu/velask' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Posso visitar o apartamento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Agende uma visita através do formulário, WhatsApp ou email. Segunda a sexta, das 9h às 18h.',
      },
    },
    {
      '@type': 'Question',
      name: 'Os apartamentos têm cozinha equipada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Todos os apartamentos são entregues com cozinha totalmente equipada.',
      },
    },
    {
      '@type': 'Question',
      name: 'Há possibilidade de financiamento bancário?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Os apartamentos são elegíveis para crédito habitação. Podemos encaminhá-lo para o nosso parceiro financeiro para uma simulação gratuita.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a data de entrega?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A obra estará concluída em aproximadamente 60 dias. Contacte-nos para reservar já a sua fração.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a certificação energética?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A certificação energética está em processo de emissão. Disponível em breve.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quem é a HABTA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A HABTA é um grupo imobiliário de alta performance. O Velask é o nosso primeiro projeto de reabilitação no Porto — entregue com o mesmo rigor de processo que aplicamos a todos os nossos empreendimentos.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso fazer uma proposta diferente do preço?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fale connosco. Analisamos cada situação individualmente.',
      },
    },
  ],
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
          __html: JSON.stringify([realEstateListingJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />
      {children}
    </>
  );
}
