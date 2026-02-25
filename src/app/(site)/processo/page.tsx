import type { Metadata } from 'next';
import ProcessoContent from './_components/ProcessoContent';

export const metadata: Metadata = {
  title: 'Processo',
  description: 'As 7 etapas do processo HABTA - da prospeccao a distribuicao de lucros',
};

export default function Page() {
  return <ProcessoContent />;
}
