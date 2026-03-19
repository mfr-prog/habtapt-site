import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fetchPropertyBySlug } from '../_lib/fetchProperties';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

const PropertyDetailContent = dynamic(
  () => import('./_components/PropertyDetailContent'),
  { ssr: false, loading: () => <div style={{ minHeight: '60vh' }} /> }
);

export const runtime = 'edge';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';

async function fetchPropertyForMetadata(slug: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/projects/by-slug/${encodeURIComponent(slug)}`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
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
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchPropertyForMetadata(slug);

  if (project) {
    const title = project.metaTitle || project.title;
    const description = project.metaDescription
      || (project.shortDescription
        ? project.shortDescription.slice(0, 160)
        : `${project.title} — Imóvel HABTA em ${project.location || 'Portugal'}`);
    const ogImage = project.ogImageUrl || project.image || undefined;

    return {
      title,
      description,
      alternates: { canonical: `https://habta.eu/imoveis/${slug}` },
      openGraph: {
        title: `${title} | HABTA`,
        description,
        type: 'article',
        locale: 'pt_PT',
        siteName: 'HABTA',
        url: `https://habta.eu/imoveis/${slug}`,
        ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | HABTA`,
        description,
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  }

  return {
    title: 'Imóvel | HABTA',
    description: 'Descubra este imóvel exclusivo da HABTA. Apartamentos e moradias premium em Portugal.',
    alternates: { canonical: `https://habta.eu/imoveis/${slug}` },
  };
}

function generateBreadcrumbJsonLd(project: Record<string, unknown> | null, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://habta.eu' },
      { '@type': 'ListItem', position: 2, name: 'Imóveis', item: 'https://habta.eu/imoveis' },
      { '@type': 'ListItem', position: 3, name: (project?.title as string) || 'Imóvel', item: `https://habta.eu/imoveis/${slug}` },
    ],
  };
}

function generateRealEstateJsonLd(project: Record<string, unknown> | null, slug: string) {
  if (!project) return null;

  const salePriceNumeric = project.salePriceNumeric as number | null | undefined;
  const rentMonthly = project.rentMonthly as number | null | undefined;
  const listingType = project.listingType as string | undefined;

  const offers: Record<string, unknown>[] = [];
  if (salePriceNumeric && (listingType === 'venda' || listingType === 'venda_e_arrendamento')) {
    offers.push({
      '@type': 'Offer',
      price: salePriceNumeric,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    });
  }
  if (rentMonthly && (listingType === 'arrendamento' || listingType === 'venda_e_arrendamento')) {
    offers.push({
      '@type': 'Offer',
      price: rentMonthly,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: rentMonthly,
        priceCurrency: 'EUR',
        unitText: 'MONTH',
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: project.title,
    description: project.shortDescription || project.description || '',
    url: `https://habta.eu/imoveis/${slug}`,
    ...(project.image ? { image: project.image } : {}),
    ...(project.location ? {
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.location,
        ...(project.district ? { addressRegion: project.district } : {}),
        ...(project.postalCode ? { postalCode: project.postalCode } : {}),
        addressCountry: 'PT',
      },
    } : {}),
    ...(offers.length === 1 ? { offers: offers[0] } : offers.length > 1 ? { offers } : {}),
    ...(project.grossAreaM2 ? {
      floorSize: {
        '@type': 'QuantitativeValue',
        value: project.grossAreaM2,
        unitCode: 'MTK',
      },
    } : {}),
    ...(project.bedrooms ? { numberOfRooms: project.bedrooms } : {}),
    provider: {
      '@id': 'https://habta.eu/#organization',
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [metaProject, property] = await Promise.all([
    fetchPropertyForMetadata(slug),
    fetchPropertyBySlug(slug),
  ]);

  if (!property) {
    notFound();
  }

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(metaProject, slug);
  const realEstateJsonLd = generateRealEstateJsonLd(metaProject, slug);
  const jsonLd = realEstateJsonLd ? [breadcrumbJsonLd, realEstateJsonLd] : [breadcrumbJsonLd];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PropertyDetailContent property={property} />
    </>
  );
}
