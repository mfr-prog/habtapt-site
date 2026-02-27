import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter-latin.woff2',
      style: 'normal',
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HABTA — Reabilitação Urbana e Investimento Imobiliário em Portugal",
    template: "%s | HABTA",
  },
  description:
    "Reabilitação urbana, investimento imobiliário e co-investimento em Portugal. Imóveis reabilitados premium em Lisboa, Porto e Cascais. Decisões baseadas em dados para património de alta performance.",
  metadataBase: new URL("https://habta.eu"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "HABTA",
    title: "HABTA — Reabilitação Urbana e Investimento Imobiliário em Portugal",
    description: "Reabilitação urbana, investimento imobiliário e co-investimento em Portugal. Imóveis reabilitados premium em Lisboa, Porto e Cascais.",
    url: "https://habta.eu",
    images: [
      {
        url: "https://habta.eu/og-image.png",
        width: 1200,
        height: 630,
        alt: "HABTA — Reabilitação Urbana e Investimento Imobiliário em Portugal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HABTA — Reabilitação Urbana e Investimento Imobiliário em Portugal",
    description: "Reabilitação urbana, investimento imobiliário e co-investimento em Portugal. Imóveis reabilitados premium.",
    images: ["https://habta.eu/og-image.png"],
  },
  alternates: {
    canonical: "https://habta.eu",
    languages: {
      'pt-PT': 'https://habta.eu',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: 'your-verification-code',
  },
  other: {
    'geo.region': 'PT',
    'geo.placename': 'Cascais, Portugal',
    'geo.position': '38.6969;-9.4207',
    'ICBM': '38.6969, -9.4207',
    'content-language': 'pt-PT',
  },
};

const organizationJsonLd = {
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
  image: 'https://habta.eu/og-image.png',
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
    {
      '@type': 'City',
      name: 'Lisboa',
    },
    {
      '@type': 'City',
      name: 'Porto',
    },
    {
      '@type': 'City',
      name: 'Cascais',
    },
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

const websiteJsonLd = {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="theme-color" content="#1A3E5C" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://xrgcrvhmzoxfduhytzhk.supabase.co" />
        <link rel="dns-prefetch" href="https://xrgcrvhmzoxfduhytzhk.supabase.co" />
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=avif&ixlib=rb-4.1.0&q=50&w=768"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
