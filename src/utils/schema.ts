// Structured Data (JSON-LD) for HABTA — used in root layout

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': 'https://habta.eu/#organization',
  name: 'HABTA',
  legalName: 'Jornada Prometida LDA',
  url: 'https://habta.eu',
  logo: {
    '@type': 'ImageObject',
    url: 'https://habta.eu/icon.svg',
    width: 512,
    height: 512,
  },
  image: 'https://habta.eu/opengraph-image',
  description: 'Reabilitação urbana, investimento imobiliário e co-investimento em Portugal. Imóveis reabilitados premium em Lisboa, Porto e Cascais. Decisões baseadas em dados para património de alta performance.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Fernão Lopes, n.º 23',
    addressLocality: 'Cascais',
    addressRegion: 'Lisboa',
    postalCode: '2765-088',
    addressCountry: 'PT',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.6969,
    longitude: -9.4207,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+351963290394',
    contactType: 'sales',
    availableLanguage: ['Portuguese', 'English'],
    email: 'contato@habta.eu',
    areaServed: 'PT',
  },
  sameAs: [
    'https://www.linkedin.com/company/habta',
    'https://www.instagram.com/habta.eu',
  ],
  taxID: '518493644',
  foundingDate: '2024',
  numberOfEmployees: {
    '@type': 'QuantitativeValue',
    minValue: 1,
    maxValue: 10,
  },
  areaServed: [
    { '@type': 'City', name: 'Lisboa' },
    { '@type': 'City', name: 'Porto' },
    { '@type': 'City', name: 'Cascais' },
  ],
  knowsAbout: [
    'Reabilitação urbana',
    'Investimento imobiliário',
    'Fix and flip',
    'Co-investimento imobiliário',
    'Gestão de património imobiliário',
    'Compra e venda de imóveis',
    'Imóveis reabilitados',
  ],
  priceRange: '€€€',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://habta.eu/#website',
  name: 'HABTA',
  url: 'https://habta.eu',
  description: 'Reabilitação urbana e investimento imobiliário em Portugal',
  publisher: {
    '@id': 'https://habta.eu/#organization',
  },
  inLanguage: 'pt-PT',
};
