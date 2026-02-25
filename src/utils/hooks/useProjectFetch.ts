/**
 * Custom Hook: useProjectFetch
 * Hook para buscar projetos com error handling robusto, cache e fallback automático
 */

import { useState, useEffect } from 'react';
import { supabaseFetch } from '../supabase/client';
import { projectsCache, CACHE_KEYS } from '../projectsCache';

export interface Project {
  id: string;
  title: string;
  location: string;
  status: string;
  strategy: string;
  investment: string;
  roi: string;
  duration: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  year: string;
  forSale: boolean;
  salePrice: string | null;
  portalLink: string | null;
  brochureLink: string | null;
  landingPage?: string | null;
  type?: string;
  description: string;
  highlights: string[];
  timeline: Array<{
    phase: string;
    duration: string;
    status: string;
  }>;
  financials: {
    acquisition?: string;
    renovation?: string;
    total?: string;
    sale?: string;
    profit?: string;
    roi?: string;
  };
  image: string;
}

interface UseProjectFetchOptions {
  mockData?: Project[];
  onError?: (error: Error) => void;
}

interface UseProjectFetchResult {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar um projeto específico por ID
 */
export const useProjectFetch = (
  projectId: string | undefined,
  options: UseProjectFetchOptions = {}
): UseProjectFetchResult => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    if (!projectId) {
      setError('ID do projeto não fornecido');
      setIsLoading(false);
      return;
    }

    console.log(`[useProjectFetch] Starting fetch for project ID: ${projectId}`);

    // Verificar cache primeiro
    const cached = projectsCache.get<Project>(CACHE_KEYS.PROJECT_BY_ID(projectId));
    if (cached) {
      console.log(`[useProjectFetch] ⚡ Using cached project: ${projectId}`);
      setProject(cached);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Tentar buscar do servidor
      const response = await supabaseFetch(`projects/${projectId}`, {}, 2);

      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}`);
      }

      const data = await response.json();
      console.log(`[useProjectFetch] Server data received:`, data);

      if (!data.project) {
        throw new Error('Projeto não encontrado no servidor');
      }

      // Calcular financials dinamicamente a partir dos dados disponíveis
      const investmentValue = data.project.investment || '€0';
      const priceValue = data.project.price || '€0';
      const roiValue = data.project.roi || '+0%';
      
      const parseValue = (str: string) => {
        const num = parseFloat(str.replace(/[€,.\s]/g, '').trim());
        return isNaN(num) ? 0 : num;
      };
      
      const investmentNum = parseValue(investmentValue);
      const priceNum = parseValue(priceValue);
      const profitNum = priceNum - investmentNum;
      
      const formatCurrency = (num: number) => `€${num.toLocaleString('pt-PT')}`;

      // Mapear status do servidor para os valores esperados pelo frontend
      const statusMapping: Record<string, string> = {
        'analysis': 'in-progress',
        'in-progress': 'in-progress',
        'completed': 'sold', // Migrar "completed" para "sold"
        'available': 'available',
        'sold': 'sold',
      };

      const mappedStatus = statusMapping[data.project.status] || data.project.status;

      // Adaptar dados do servidor
      const adaptedProject: Project = {
        ...data.project,
        status: mappedStatus, // Usar status mapeado
        duration: data.project.timeline || 'N/A',
        year: new Date().getFullYear().toString(),
        forSale: mappedStatus === 'available',
        salePrice: priceValue,
        portalLink: data.project.portalLink || null,
        brochureLink: data.project.brochureLink || null,
        landingPage: data.project.landingPage || null,
        type: 'Apartamento',
        description: data.project.description || '',
        highlights: data.project.highlights
          ? data.project.highlights.split('\n').filter((h: string) => h.trim())
          : [],
        timeline: data.project.timelinePhases
          ? data.project.timelinePhases
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
      };

      console.log(`[useProjectFetch] ✅ Project loaded from server`);
      console.log(`[useProjectFetch] 📊 Financials:`, adaptedProject.financials);
      console.log(`[useProjectFetch] 📝 Description:`, adaptedProject.description);
      console.log(`[useProjectFetch] ⏰ Timeline:`, adaptedProject.timeline);
      console.log(`[useProjectFetch] 🔗 Links:`, { portalLink: adaptedProject.portalLink, brochureLink: adaptedProject.brochureLink });
      
      // Salvar no cache
      projectsCache.set(CACHE_KEYS.PROJECT_BY_ID(projectId), adaptedProject);
      
      setProject(adaptedProject);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      console.error(`[useProjectFetch] ❌ Error fetching project:`, err);

      // Tentar usar mock data como fallback
      if (options.mockData) {
        const mockProject = options.mockData.find(p => p.id === projectId);
        if (mockProject) {
          console.log(
            `[useProjectFetch] ⚠️ Using mock data as fallback for project ${projectId}`
          );
          setProject(mockProject);
          setError(null); // Não mostrar erro se conseguiu fallback
        } else {
          console.error(
            `[useProjectFetch] Mock data not found for project ${projectId}`
          );
          setError(`Projeto não encontrado (ID: ${projectId})`);
          setProject(null);
        }
      } else {
        setError(errorMessage);
        setProject(null);
      }

      // Chamar callback de erro se fornecido
      if (options.onError && err instanceof Error) {
        options.onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return {
    project,
    isLoading,
    error,
    refetch: fetchProject,
  };
};

/**
 * Hook para buscar lista de projetos
 */
export const useProjectsList = (
  options: UseProjectFetchOptions = {}
): {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    console.log(`[useProjectsList] Starting fetch`);

    try {
      setIsLoading(true);
      setError(null);

      const response = await supabaseFetch('projects', {}, 2);

      if (!response.ok) {
        throw new Error(`Servidor retornou status ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `[useProjectsList] Server data received: ${data.projects?.length || 0} projects`
      );

      if (!data.projects || !Array.isArray(data.projects)) {
        throw new Error('Formato de resposta inválido');
      }

      console.log(`[useProjectsList] ✅ ${data.projects.length} projects loaded`);
      setProjects(data.projects);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      console.error(`[useProjectsList] ❌ Error fetching projects:`, err);

      // Tentar usar mock data como fallback
      if (options.mockData) {
        console.log(
          `[useProjectsList] ⚠️ Using mock data as fallback (${options.mockData.length} projects)`
        );
        setProjects(options.mockData);
        setError(null); // Não mostrar erro se conseguiu fallback
      } else {
        setError(errorMessage);
        setProjects([]);
      }

      // Chamar callback de erro se fornecido
      if (options.onError && err instanceof Error) {
        options.onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
  };
};
