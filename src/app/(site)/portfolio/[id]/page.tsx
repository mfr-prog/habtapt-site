import type { Metadata } from 'next';
import PortfolioDetailContent from './_components/PortfolioDetailContent';

export const runtime = 'edge';

const SUPABASE_URL = 'https://xrgcrvhmzoxfduhytzhk.supabase.co';
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';

async function fetchProject(id: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/projects/${id}`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ2Nydmhtem94ZmR1aHl0emhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzQ5MDEsImV4cCI6MjA3Nzc1MDkwMX0.kuOHXFvX3s5yTDmxA4KBw_r6NDZxmsQtZRm_WDkdGUE`,
      },
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
      : `${project.title} — Projeto de reabilitacao HABTA em ${project.location || 'Portugal'}`;

    return {
      title,
      description,
      alternates: { canonical: `https://habta.eu/portfolio/${id}` },
      openGraph: {
        title: `${title} | HABTA`,
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
    title: `Projeto ${id}`,
    description: 'Detalhes do projeto de reabilitacao HABTA',
    alternates: { canonical: `https://habta.eu/portfolio/${id}` },
  };
}

export default function Page() {
  return <PortfolioDetailContent />;
}
