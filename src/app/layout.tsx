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
    "Patrimonio de alta performance. Decisoes baseadas em dados. Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal.",
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
