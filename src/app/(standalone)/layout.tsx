import { Toaster } from "@/components/ui/sonner";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        duration={4000}
        closeButton
        richColors
      />
    </>
  );
}
