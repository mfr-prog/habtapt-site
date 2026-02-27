import type { Metadata } from 'next';
import ProcessoContent from './_components/ProcessoContent';

export const metadata: Metadata = {
  title: 'Processo',
  description: 'As 7 etapas do processo HABTA - da prospecção ao fecho do projeto',
  alternates: {
    canonical: 'https://habta.eu/processo',
  },
  openGraph: {
    title: 'Processo',
    description: 'As 7 etapas do processo HABTA - da prospecção ao fecho do projeto',
    url: 'https://habta.eu/processo',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function Page() {
  return <ProcessoContent />;
}
