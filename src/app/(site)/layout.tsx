"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Toaster } from "@/components/ui/sonner";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <Toaster
        position="top-right"
        duration={4000}
        closeButton
        richColors
        toastOptions={{
          style: {
            background: "white",
            color: "#0F1729",
            border: "1px solid rgba(26, 62, 92, 0.12)",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(26, 62, 92, 0.15)",
          },
        }}
      />
    </div>
  );
}
