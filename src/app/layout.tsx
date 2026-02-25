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
    default: "HABTA | Reabilitação Inteligente e Investimento Sustentável",
    template: "%s | HABTA",
  },
  description:
    "Património de alta performance. Decisões baseadas em dados. Reabilitação urbana, investimento imobiliário e co-investimento em Portugal.",
  metadataBase: new URL("https://habta.eu"),
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "HABTA",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
