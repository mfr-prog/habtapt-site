import type { Metadata } from 'next';
import { Contact } from '@/components/Contact';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Contacto — Fale com a Equipa HABTA',
  description: 'Entre em contacto com a HABTA para discutir o seu projeto imobiliário. Consultoria gratuita sobre investimento imobiliário e reabilitação urbana em Portugal. Cascais, Lisboa e Porto.',
  alternates: {
    canonical: 'https://habta.eu/contacto',
  },
  openGraph: {
    title: 'Contacto — Fale com a Equipa HABTA',
    description: 'Entre em contacto com a HABTA. Consultoria gratuita sobre investimento imobiliário e reabilitação urbana em Portugal.',
    url: 'https://habta.eu/contacto',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://habta.eu' },
    { '@type': 'ListItem', position: 2, name: 'Contacto', item: 'https://habta.eu/contacto' },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Como funciona o processo de investimento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O nosso processo é estruturado em 7 etapas: prospeção, avaliação técnica e jurídica, negociação, reforma com gestão controlada, marketing 360°, venda e fecho do projeto. Cada fase é transparente e acompanhada de perto pelos nossos parceiros.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual o prazo médio de um projeto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O ciclo completo varia entre 3 a 12 meses, dependendo da complexidade da obra e das condições do mercado. Fornecemos cronograma detalhado desde o início e atualizações semanais do progresso.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual o retorno esperado de investimento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cada projeto é avaliado individualmente com base em análise de mercado rigorosa e due diligence completa. Apresentamos projeções financeiras detalhadas e transparentes para cada oportunidade, permitindo uma decisão informada.',
      },
    },
    {
      '@type': 'Question',
      name: 'Preciso ter conhecimento técnico para investir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. A nossa equipa cuida de todo o processo técnico, jurídico e operacional. Recebe relatórios simplificados e tem acesso a consultoria especializada sempre que necessário.',
      },
    },
    {
      '@type': 'Question',
      name: 'Como acompanho o andamento do projeto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Disponibilizamos acompanhamento online 24/7 com fotos, vídeos e relatórios semanais. Além disso, pode visitar a obra presencialmente mediante agendamento e tem acesso direto à equipa de gestão.',
      },
    },
  ],
};

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, faqJsonLd]) }}
      />
      <Section background="white" style={{ paddingTop: '7.5rem' }}>
        <Contact />
      </Section>
    </>
  );
}
