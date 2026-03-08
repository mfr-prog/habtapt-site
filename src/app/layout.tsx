import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { organizationJsonLd, websiteJsonLd } from "@/utils/schema";
import "./globals.css";

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter-latin.woff2',
      style: 'normal',
    },
  ],
  variable: "--font-inter",
  display: "optional",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "HABTA — Reabilitação Urbana e Investimento Imobiliário em Portugal",
    description: "Reabilitação urbana, investimento imobiliário e co-investimento em Portugal. Imóveis reabilitados premium.",
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
    google: 'nJHhL_Gc7I7MvkU3QcLCxJmgWbAylGLumR6VS3bwWdI',
  },
  other: {
    'geo.region': 'PT',
    'geo.placename': 'Cascais, Portugal',
    'geo.position': '38.6969;-9.4207',
    'ICBM': '38.6969, -9.4207',
    'content-language': 'pt-PT',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#1A3E5C" />
        <link
          rel="preload"
          as="image"
          imageSrcSet="/images/hero/hero-480.avif 480w, /images/hero/hero-768.avif 768w, /images/hero/hero-1080.avif 1080w, /images/hero/hero-1600.avif 1600w"
          imageSizes="100vw"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Script id="ga4-deferred" strategy="lazyOnload">{`
          (function(){var l=false;function g(){if(l)return;l=true;var s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=G-ZKN7PMCDBP';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function t(){dataLayer.push(arguments)}t('js',new Date());t('config','G-ZKN7PMCDBP')}['scroll','click','touchstart'].forEach(function(e){document.addEventListener(e,g,{once:true,passive:true})});setTimeout(g,8000)})();
        `}</Script>
        <Script id="atd-err" strategy="lazyOnload">{`
          (function(){var o=console.error;console.error=function(){var a=[].slice.call(arguments).join(' ');if(a.indexOf('Atendimento Widget')!==-1||a.indexOf('atendeaqui')!==-1)return;o.apply(console,arguments)}})();
        `}</Script>
        <Script id="atd-hide-css" strategy="lazyOnload">{`
          (function(){var s=document.createElement('style');s.textContent='#atendimento-widget-root:not([data-chat-open]){position:fixed!important;bottom:-9999px!important;right:-9999px!important;opacity:0!important;pointer-events:none!important;width:0!important;height:0!important;overflow:hidden!important;z-index:-1!important}';document.head.appendChild(s);window.__openAtdChat=function(){var r=document.getElementById('atendimento-widget-root');if(r){r.setAttribute('data-chat-open','1');setTimeout(function(){var b=r.querySelector('button')||r.querySelector('[role=button]');if(r.shadowRoot){b=r.shadowRoot.querySelector('button')||r.shadowRoot.querySelector('[role=button]')||r.shadowRoot.querySelector('.atd-bubble')}if(b)b.click()},100)}};window.__closeAtdChat=function(){var r=document.getElementById('atendimento-widget-root');if(r)r.removeAttribute('data-chat-open')}})();
        `}</Script>
        <Script
          src="https://widget.atendeaqui.ai/widget.js"
          data-tenant="habta"
          data-channel="web"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
