import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const ScrollProgress = dynamic(
  () => import("@/components/ScrollProgress").then((m) => ({ default: m.ScrollProgress }))
);
const WhatsAppButton = dynamic(
  () => import("@/components/WhatsAppButton").then((m) => ({ default: m.WhatsAppButton }))
);
const BackToTop = dynamic(
  () => import("@/components/BackToTop").then((m) => ({ default: m.BackToTop }))
);
const CookieConsent = dynamic(
  () => import("@/components/CookieConsent").then((m) => ({ default: m.CookieConsent }))
);
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster }))
);

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-white focus:text-[#1A3E5C] focus:rounded-lg focus:shadow-lg focus:font-semibold"
      >
        Saltar para o conteúdo principal
      </a>
      <ScrollProgress />
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
      <CookieConsent />
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
