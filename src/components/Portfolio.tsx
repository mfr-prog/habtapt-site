'use client';

// Portfolio Component - v3.0.0 - Otimizado para Performance
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { Building2 } from './icons';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from './useInView';
import { designSystem } from './design-system';
import { useRouter } from 'next/navigation';
import { supabaseFetch } from '../utils/supabase/client';
import { projectsCache, CACHE_KEYS } from '../utils/projectsCache';
import { PortfolioCard } from './primitives/PortfolioCard';
import { PortfolioGridSkeleton } from './primitives/PortfolioGridSkeleton';

type ProjectStatus = 'all' | 'analysis' | 'in-progress' | 'available' | 'sold';
type InvestmentStrategy = 'buy-hold' | 'fix-flip' | 'alojamento-local' | 'rent-to-rent' | 'desenvolvimento' | 'co-investimento';

interface Project {
  id: string;
  title: string;
  location: string;
  status: Exclude<ProjectStatus, 'all'>;
  statusLabel: string;
  strategy: InvestmentStrategy;
  image: string;
  roi: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  investment: string;
  timeline: string;
  description: string;
  highlights?: string;
  landingPage?: string;
}

export function Portfolio() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ProjectStatus>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fallback projects (dados originais do site)
  const fallbackProjects: Project[] = useMemo(() => [
    {
      id: 'velask',
      title: 'VELASK Residence',
      location: 'Antas, Porto',
      status: 'available',
      statusLabel: 'Disponível',
      strategy: 'fix-flip',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+25%',
      area: '334 m²',
      bedrooms: 6,
      bathrooms: 7,
      price: 'Sob consulta',
      investment: 'Sob consulta',
      timeline: 'Entrega 2026',
      description: 'Três apartamentos a estrear nas Antas (Porto), com jardins privados, garagem e duplex com piso superior.',
      highlights: 'Jardins privados até 27,80 m²\nExterior total até 34,06 m²\nGaragem privativa (R/C)\nPiso superior 33,11 m² (Duplex)\nApenas 3 unidades\nLocalização premium nas Antas',
      landingPage: '/velask',
    },
    {
      id: '1',
      title: 'Apartamento Premium Centro Lisboa',
      location: 'Chiado, Lisboa',
      status: 'sold',
      statusLabel: 'Vendido',
      strategy: 'fix-flip',
      image: 'https://images.unsplash.com/photo-1695395894170-ff75a98f176c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvciUyMHBvcnR1Z2FsfGVufDF8fHx8MTc2MTg1MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+32%',
      area: '95 m²',
      bedrooms: 2,
      bathrooms: 2,
      price: '€420.000',
      investment: '€318.000',
      timeline: '9 meses',
      description: 'Apartamento premium reabilitado em Lisboa com ROI de 32% em 9 meses.',
      highlights: 'Restauro de fachada histórica em azulejos\\nPreservação de elementos arquitetónicos originais\\nSistema de climatização eficiente\\nCozinha e casas de banho de design premium\\nCertificação energética A\\nLocalização prime no Chiado',
    },
    {
      id: '2',
      title: 'Moradia Contemporânea Cascais',
      location: 'Estoril, Cascais',
      status: 'sold',
      statusLabel: 'Vendido',
      strategy: 'fix-flip',
      image: 'https://images.unsplash.com/photo-1561753757-d8880c5a3551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZW5vdmF0ZWQlMjBob21lJTIwZXVyb3BlfGVufDF8fHx8MTc2MTg1MzQxMnww&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+28%',
      area: '180 m²',
      bedrooms: 4,
      bathrooms: 3,
      price: '€750.000',
      investment: '€585.000',
      timeline: '11 meses',
      description: 'Moradia de luxo com design contemporâneo e acabamentos premium.',
      highlights: 'Arquitetura contemporânea de alto padrão\\nJardim paisagístico com piscina\\nSistema domótico integrado\\nCozinha gourmet totalmente equipada\\nGaragem para 3 veículos\\nVista mar panorâmica',
    },
    {
      id: '3',
      title: 'Loft Moderno Zona Histórica',
      location: 'Alfama, Lisboa',
      status: 'in-progress',
      statusLabel: 'Em Andamento',
      strategy: 'buy-hold',
      image: 'https://images.unsplash.com/photo-1600876188212-40de3a9218ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob3VzZSUyMHBvcnR1Z2FsJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTg1MzQxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+35%',
      area: '120 m²',
      bedrooms: 2,
      bathrooms: 2,
      price: '€485.000',
      investment: '€359.000',
      timeline: '7 meses',
      description: 'Transformação de edifício histórico em loft moderno de alto padrão.',
      highlights: 'Conceito open-space moderno\\nPé-direito duplo com mezanino\\nPreservação de paredes em pedra original\\nIluminação natural abundante\\nAcabamentos de luxo\\nLocalização histórica premium',
    },
    {
      id: '4',
      title: 'Edifício Reabilitação Integral',
      location: 'Baixa, Porto',
      status: 'in-progress',
      statusLabel: 'Em Andamento',
      strategy: 'fix-flip',
      image: 'https://images.unsplash.com/photo-1683880356566-3245383f3a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHJlbm92YXRpb24lMjBidWlsZGluZyUyMGxpc2JvbnxlbnwxfHx8fDE3NjE4NTM0MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+40%',
      area: '450 m²',
      bedrooms: 6,
      bathrooms: 5,
      price: '€1.250.000',
      investment: '€893.000',
      timeline: '14 meses',
      description: 'Projeto completo de reabilitação urbana em zona premium do Porto.',
      highlights: 'Reabilitação de fachada histórica\\n6 apartamentos de luxo\\nElevador moderno instalado\\nSistema centralizado de climatização\\nCertificação energética A+\\nLocalização premium na Baixa do Porto',
    },
    {
      id: '5',
      title: 'Apartamento Vista Mar',
      location: 'Cascais',
      status: 'available',
      statusLabel: 'Disponível',
      strategy: 'buy-hold',
      image: 'https://images.unsplash.com/photo-1759150712360-6d48015e4f86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjByZW5vdmF0aW9ufGVufDF8fHx8MTc2MTc3NTk3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+30%',
      area: '135 m²',
      bedrooms: 3,
      bathrooms: 2,
      price: '€595.000',
      investment: '€458.000',
      timeline: '8 meses',
      description: 'Oportunidade com vista mar e alto potencial de valorização.',
      highlights: 'Vista mar deslumbrante\\nCondomínio fechado com segurança 24h\\nPiscina comum e ginásio\\n2 lugares de garagem\\nPróximo à praia (5 min a pé)\\nAlto potencial de valorização',
    },
    {
      id: '6',
      title: 'Penthouse Centro Histórico',
      location: 'Bairro Alto, Lisboa',
      status: 'in-progress',
      statusLabel: 'Em Andamento',
      strategy: 'fix-flip',
      image: 'https://images.unsplash.com/photo-1716807335144-33e138f1858a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwaW50ZXJpb3IlMjBkZXNpZ258ZW58MXx8fHwxNzYxODIwNjQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      roi: '+38%',
      area: '160 m²',
      bedrooms: 3,
      bathrooms: 3,
      price: '€720.000',
      investment: '€522.000',
      timeline: '10 meses',
      description: 'Penthouse de luxo em localização premium com terraço privativo.',
      highlights: 'Terraço privativo de 80m²\\nVistas panorâmicas de Lisboa\\nLocalização premium no Bairro Alto\\nTetos altos (3.5m)\\nLuz natural abundante\\nPotencial para piscina no terraço',
    },
  ], []);

  // Mobile check otimizado
  useEffect(() => {
    const lgBreakpoint = parseInt(designSystem.breakpoints.lg);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < lgBreakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch projects com cache
  useEffect(() => {
    const fetchProjects = async () => {
      // Verificar cache primeiro
      const cached = projectsCache.get<Project[]>(CACHE_KEYS.ALL_PROJECTS);
      if (cached) {
        setProjects(cached);
        setIsLoadingProjects(false);
        return;
      }

      try {
        setIsLoadingProjects(true);
        const response = await supabaseFetch('projects');

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.projects && data.projects.length > 0) {
            // Validar status
            data.projects.forEach((p: any) => {
              if (!['analysis', 'in-progress', 'available', 'sold'].includes(p.status)) {
                console.warn(`[Portfolio] ⚠️ Invalid status "${p.status}" in project: ${p.title} (ID: ${p.id})`);
              }
            });
            
            setProjects(data.projects);
            
            // Salvar no cache
            projectsCache.set(CACHE_KEYS.ALL_PROJECTS, data.projects);
          } else {
            setProjects(fallbackProjects);
          }
        } else {
          console.warn('[Portfolio] ⚠️ Failed to fetch projects, using fallback data');
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error('[Portfolio] ❌ Error fetching projects:', error);
        setProjects(fallbackProjects);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [fallbackProjects]);

  const filters: { value: ProjectStatus; label: string }[] = useMemo(() => [
    { value: 'all', label: 'Todos' },
    { value: 'analysis', label: 'Em Análise' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'available', label: 'Disponível' },
    { value: 'sold', label: 'Vendidos' },
  ], []);

  // Filtrar projetos com useMemo
  const filteredProjects = useMemo(
    () => (activeFilter === 'all' ? projects : projects.filter((p) => p.status === activeFilter)),
    [activeFilter, projects]
  );

  // Handler memoizado - abre sempre a página de detalhes do projeto
  const handleProjectClick = useCallback(
    (id: string) => {
      router.push(`/portfolio/${id}`);
    },
    [router]
  );

  return (
    <Section id="portfolio" background="muted">
      <Container>
        <section aria-labelledby="portfolio-title">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mx-auto"
            style={{
              marginBottom: designSystem.spacing[16],
              maxWidth: '56rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center rounded-full"
              style={{
                gap: designSystem.spacing[2],
                paddingLeft: designSystem.spacing[5],
                paddingRight: designSystem.spacing[5],
                paddingTop: designSystem.spacing[3],
                paddingBottom: designSystem.spacing[3],
                marginBottom: designSystem.spacing[6],
                background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.08),
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.15)}`,
              }}
            >
              <Building2 size={18} style={{ color: designSystem.colors.brand.primary }} />
              <span
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  color: designSystem.colors.brand.primary,
                  textTransform: 'uppercase',
                  letterSpacing: designSystem.typography.letterSpacing.wider,
                }}
              >
                Portfólio
              </span>
            </motion.div>

            <h2
              id="portfolio-title"
              style={{
                color: designSystem.colors.neutral[900],
                marginBottom: designSystem.spacing.md,
              }}
            >
              Projetos de Alto Retorno
            </h2>
            <p
              style={{
                color: designSystem.colors.neutral[600],
                maxWidth: '42rem',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Conheça os nossos casos de sucesso em reabilitação urbana e investimento imobiliário de alto rendimento em Portugal
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center"
            style={{
              gap: designSystem.spacing[3],
              marginBottom: designSystem.spacing[12],
            }}
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.value}
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.value)}
                className="rounded-full transition-all duration-300"
                role="button"
                aria-pressed={activeFilter === filter.value}
                aria-label={`Filtrar por ${filter.label}`}
                style={{
                  paddingLeft: designSystem.spacing[6],
                  paddingRight: designSystem.spacing[6],
                  paddingTop: designSystem.spacing[3],
                  paddingBottom: designSystem.spacing[3],
                  background:
                    activeFilter === filter.value
                      ? designSystem.colors.gradients.secondary
                      : designSystem.colors.neutral.white,
                  color:
                    activeFilter === filter.value
                      ? designSystem.colors.brand.primary
                      : designSystem.colors.brand.primary,
                  border: `2px solid ${
                    activeFilter === filter.value
                      ? 'transparent'
                      : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.25)
                  }`,
                  fontWeight: designSystem.typography.fontWeight.bold,
                  fontSize: '0.9375rem',
                  boxShadow:
                    activeFilter === filter.value ? designSystem.shadows.secondaryHover : designSystem.shadows.sm,
                  cursor: 'pointer',
                }}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects Grid with Skeleton */}
          {isLoadingProjects ? (
            <PortfolioGridSkeleton count={6} isMobile={isMobile} />
          ) : (
            <AnimatePresence mode="sync">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                style={{
                  gap: designSystem.spacing[6],
                }}
              >
                {filteredProjects.map((project, index) => (
                  <PortfolioCard
                    key={project.id}
                    project={project}
                    index={index}
                    isMobile={isMobile}
                    onClick={handleProjectClick}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!isLoadingProjects && filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: designSystem.spacing[12],
                color: designSystem.colors.neutral[600],
              }}
            >
              <p>Nenhum projeto encontrado para este filtro.</p>
            </motion.div>
          )}
        </section>
      </Container>
    </Section>
  );
}