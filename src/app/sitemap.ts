import type { MetadataRoute } from 'next';

const BASE_URL = 'https://habta.eu';
const SUPABASE_URL = 'https://xrgcrvhmzoxfduhytzhk.supabase.co';
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyZ2Nydmhtem94ZmR1aHl0emhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzQ5MDEsImV4cCI6MjA3Nzc1MDkwMX0.kuOHXFvX3s5yTDmxA4KBw_r6NDZxmsQtZRm_WDkdGUE';

async function fetchDynamicPages() {
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const insightsRes = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/insights`, {
      headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      next: { revalidate: 3600 },
    });
    if (insightsRes.ok) {
      const insightsData = await insightsRes.json();
      if (insightsData.success && insightsData.insights) {
        for (const insight of insightsData.insights) {
          dynamicPages.push({
            url: `${BASE_URL}/blog/${insight.id}`,
            lastModified: insight.updated_at || insight.date || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // Silently fail - dynamic pages are optional for sitemap
  }

  try {
    const projectsRes = await fetch(`${SUPABASE_URL}/${FUNCTION_PATH}/projects`, {
      headers: { 'Authorization': `Bearer ${ANON_KEY}` },
      next: { revalidate: 3600 },
    });
    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      const projects = projectsData.projects || projectsData;
      if (Array.isArray(projects)) {
        for (const project of projects) {
          dynamicPages.push({
            url: `${BASE_URL}/portfolio/${project.id}`,
            lastModified: project.updated_at || new Date().toISOString(),
            changeFrequency: 'monthly',
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // Silently fail
  }

  return dynamicPages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/imoveis`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/velask`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/servicos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/processo`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/depoimentos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacidade`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const dynamicPages = await fetchDynamicPages();

  return [...staticPages, ...dynamicPages];
}
