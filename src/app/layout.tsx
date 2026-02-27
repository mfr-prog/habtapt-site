import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HABTA | Reabilitacao Inteligente e Investimento Sustentavel",
    template: "%s | HABTA",
  },
  description:
    "Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal. Decisoes baseadas em dados para patrimonio de alta performance.",
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
    title: "HABTA | Reabilitacao Inteligente e Investimento Sustentavel",
    description: "Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal. Decisoes baseadas em dados para patrimonio de alta performance.",
    url: "https://habta.eu",
  },
  twitter: {
    card: "summary_large_image",
    title: "HABTA | Reabilitacao Inteligente e Investimento Sustentavel",
    description: "Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal.",
  },
  alternates: {
    canonical: "https://habta.eu",
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
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'HABTA',
  legalName: 'Jornada Prometida LDA',
  url: 'https://habta.eu',
  logo: 'https://habta.eu/icon.svg',
  description: 'Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal. Decisoes baseadas em dados para patrimonio de alta performance.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua Fernao Lopes, n.o 23',
    addressLocality: 'Cascais',
    postalCode: '2765-088',
    addressCountry: 'PT',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+351963290394',
    contactType: 'sales',
    availableLanguage: ['Portuguese', 'English'],
    email: 'contato@habta.eu',
  },
  sameAs: [
    'https://www.linkedin.com/company/habta',
    'https://www.instagram.com/habta.eu',
  ],
  taxID: '518493644',
  areaServed: {
    '@type': 'Country',
    name: 'Portugal',
  },
  knowsAbout: [
    'Reabilitacao urbana',
    'Investimento imobiliario',
    'Fix and flip',
    'Co-investimento',
    'Gestao de patrimonio imobiliario',
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
