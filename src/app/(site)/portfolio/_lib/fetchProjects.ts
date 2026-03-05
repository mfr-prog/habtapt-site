import type { Project } from '@/types/project';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_ID || 'xrgcrvhmzoxfduhytzhk'}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const FUNCTION_PATH = 'functions/v1/make-server-4b2936bc';

export async function fetchProjects(): Promise<Project[]> {
  try {
    const url = `${SUPABASE_URL}/${FUNCTION_PATH}/projects`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`[fetchProjects] Server returned ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
      return data.projects as Project[];
    }

    return [];
  } catch (error) {
    console.error('[fetchProjects] Error:', error);
    return [];
  }
}

/** Adapt raw server data to the Project shape expected by the UI (mirrors useProjectFetch logic) */
function adaptProject(raw: any): Project {
  const statusMapping: Record<string, string> = {
    'analysis': 'in-progress',
    'in-progress': 'in-progress',
    'completed': 'sold',
    'available': 'available',
    'sold': 'sold',
  };
  const mappedStatus = statusMapping[raw.status] || raw.status;

  const investmentValue = raw.investment || '€0';
  const priceValue = raw.price || '€0';
  const roiValue = raw.roi || '+0%';

  const parseValue = (str: string) => {
    const num = parseFloat(str.replace(/[€,.\s]/g, '').trim());
    return isNaN(num) ? 0 : num;
  };
  const investmentNum = parseValue(investmentValue);
  const priceNum = parseValue(priceValue);
  const profitNum = priceNum - investmentNum;
  const formatCurrency = (num: number) => `€${num.toLocaleString('pt-PT')}`;

  return {
    ...raw,
    status: mappedStatus,
    duration: raw.timeline || 'N/A',
    year: new Date().getFullYear().toString(),
    forSale: mappedStatus === 'available',
    salePrice: priceValue,
    portalLink: raw.portalLink || null,
    brochureLink: raw.brochureLink || null,
    landingPage: raw.landingPage || null,
    type: 'Apartamento',
    description: raw.description || '',
    highlights: raw.highlights
      ? raw.highlights.split('\n').filter((h: string) => h.trim())
      : [],
    timeline: raw.timelinePhases
      ? raw.timelinePhases
          .split('\n')
          .filter((line: string) => line.trim())
          .map((line: string) => {
            const [phase, duration, status] = line.split('|');
            return { phase, duration, status };
          })
      : [],
    financials: {
      acquisition: investmentValue,
      renovation: '€0',
      total: investmentValue,
      sale: priceValue,
      profit: formatCurrency(profitNum),
      roi: roiValue,
    },
    estimatedRent: raw.estimatedRent || undefined,
    grossYield: raw.grossYield || undefined,
    netYield: raw.netYield || undefined,
    appreciationEstimate: raw.appreciationEstimate || undefined,
    propertyType: raw.propertyType || undefined,
    neighborhood: raw.neighborhood || undefined,
    finishes: raw.finishes || undefined,
    nearbyAmenities: raw.nearbyAmenities || undefined,
    lifestyle: raw.lifestyle || undefined,
    typology: raw.typology || undefined,
    deliveryDate: raw.deliveryDate || undefined,
  };
}

export async function fetchProjectById(id: string): Promise<Project | null> {
  try {
    const url = `${SUPABASE_URL}/${FUNCTION_PATH}/projects/${id}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`[fetchProjectById] Server returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.project) return null;

    return adaptProject(data.project);
  } catch (error) {
    console.error('[fetchProjectById] Error:', error);
    return null;
  }
}
