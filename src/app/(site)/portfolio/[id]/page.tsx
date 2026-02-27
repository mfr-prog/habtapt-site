import type { Metadata } from 'next';
import PortfolioDetailContent from './_components/PortfolioDetailContent';

export const runtime = 'edge';

const SUPABASE_URL = 'https://xrgcrvhmzoxfduhytzhk.supabase.co';
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ2Nydmhtem94ZmR1aHl0emhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzQ5MDEsImV4cCI6MjA3Nzc1MDkwMX0.kuOHXFvX3s5yTDmxA4KBw_r6NDZxmsQtZRm_WDkdGUE';

async function fetchProject(id: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/projects/${id}`, {
      headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.project || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProject(id);

  if (project) {
    const title = project.title;
    const description = project.description
      ? project.description.slice(0, 160)
      : `${project.title} — Projeto de reabilitação HABTA em ${project.location || 'Portugal'}`;

    return {
      title,
      description,
      alternates: { canonical: `https://habta.eu/portfolio/${id}` },
      openGraph: {
        title: `${title} — Reabilitação Urbana | HABTA`,
        description,
        type: 'article',
        locale: 'pt_PT',
        siteName: 'HABTA',
        url: `https://habta.eu/portfolio/${id}`,
        ...(project.image ? { images: [{ url: project.image, width: 1200, height: 630, alt: title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | HABTA`,
        description,
        ...(project.image ? { images: [project.image] } : {}),
      },
    };
  }

  return {
    title: 'Projeto de Reabilitação Urbana',
    description: 'Projeto de reabilitação urbana em Portugal pela HABTA. Apartamentos e moradias reabilitados com acabamentos premium.',
    alternates: { canonical: `https://habta.eu/portfolio/${id}` },
  };
}

function generateBreadcrumbJsonLd(project: any, id: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://habta.eu' },
      { '@type': 'ListItem', position: 2, name: 'Portfólio', item: 'https://habta.eu/portfolio' },
      { '@type': 'ListItem', position: 3, name: project?.title || 'Projeto', item: `https://habta.eu/portfolio/${id}` },
    ],
  };
}

function generateRealEstateJsonLd(project: any, id: string) {
  if (!project) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.title,
    description: project.description || '',
    url: `https://habta.eu/portfolio/${id}`,
    ...(project.image ? { image: project.image } : {}),
    ...(project.location ? {
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.location,
        addressCountry: 'PT',
      },
    } : {}),
    ...(project.price ? {
      offers: {
        '@type': 'Offer',
        price: project.price.replace(/[^\d]/g, ''),
        priceCurrency: 'EUR',
      },
    } : {}),
    ...(project.area ? {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: parseFloat(project.area) || 0,
        unitCode: 'MTK',
      },
    } : {}),
    provider: {
      '@id': 'https://habta.eu/#organization',
    },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await fetchProject(id);

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(project, id);
  const realEstateJsonLd = generateRealEstateJsonLd(project, id);
  const jsonLd = realEstateJsonLd ? [breadcrumbJsonLd, realEstateJsonLd] : [breadcrumbJsonLd];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioDetailContent />
    </>
  );
}
