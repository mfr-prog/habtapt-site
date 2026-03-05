import type { Metadata } from 'next';
import { Portfolio } from '@/components/Portfolio';
import { Section } from '@/components/Section';
import { fetchProjects } from './_lib/fetchProjects';

export const metadata: Metadata = {
  title: 'Portfólio de Projetos de Reabilitação Urbana',
  description: 'Projetos de reabilitação urbana concluídos e em curso em Portugal. Apartamentos e moradias reabilitados em Lisboa, Porto e Cascais pela HABTA.',
  alternates: {
    canonical: 'https://habta.eu/portfolio',
  },
  openGraph: {
    title: 'Portfólio de Projetos de Reabilitação Urbana — HABTA',
    description: 'Projetos de reabilitação urbana concluídos e em curso em Portugal. Veja os nossos apartamentos e moradias reabilitados.',
    url: 'https://habta.eu/portfolio',
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
    { '@type': 'ListItem', position: 2, name: 'Portfólio', item: 'https://habta.eu/portfolio' },
  ],
};

export default async function PortfolioPage() {
  const projects = await fetchProjects();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Section background="white" style={{ paddingTop: '7.5rem' }}>
        <Portfolio projects={projects.length > 0 ? projects : undefined} />
      </Section>
    </>
  );
}
