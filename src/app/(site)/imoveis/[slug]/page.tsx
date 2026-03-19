import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPropertyBySlug } from '../_lib/fetchProperties';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export const runtime = 'edge';

const SUPABASE_URL = `https://${projectId}.supabase.co`;
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';

async function fetchPropertyForMetadata(slug: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/projects/by-slug/${encodeURIComponent(slug)}`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` },
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
      || project.shortDescription
      || `${project.title} — Imóvel HABTA em ${project.location || 'Portugal'}`;
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
    };
  }

  return {
    title: 'Imóvel | HABTA',
    description: 'Imóvel exclusivo HABTA.',
    alternates: { canonical: `https://habta.eu/imoveis/${slug}` },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await fetchPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem' }}>{property.title}</h1>
      <p>{property.location}</p>
      <p>{property.description}</p>
      <p style={{ color: '#999', fontSize: '0.8rem' }}>
        Página de detalhe em construção — dados carregados com sucesso via slug.
      </p>
    </div>
  );
}
