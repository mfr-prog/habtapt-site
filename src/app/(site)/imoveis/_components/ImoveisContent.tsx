'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Building2 } from '@/components/icons';
import { motion, AnimatePresence } from 'motion/react';
import { designSystem } from '@/components/design-system';
import { useRouter } from 'next/navigation';
import { supabaseFetch } from '@/utils/supabase/client';
import { projectsCache, CACHE_KEYS } from '@/utils/projectsCache';
import { PortfolioCard } from '@/components/primitives/PortfolioCard';
import { PortfolioGridSkeleton } from '@/components/primitives/PortfolioGridSkeleton';
import { ViewModeToggle } from '@/components/ViewModeToggle';
import { useViewMode } from '@/utils/hooks/useViewMode';

type ProjectStatus = 'all' | 'analysis' | 'in-progress' | 'available' | 'sold';

interface Project {
  id: string;
  title: string;
  location: string;
  status: string;
  statusLabel: string;
  strategy: string;
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
  estimatedRent?: string;
  grossYield?: string;
  netYield?: string;
  appreciationEstimate?: string;
  propertyType?: 'moradia' | 'investimento' | 'ambos';
  neighborhood?: string;
  finishes?: string[];
  nearbyAmenities?: string[];
  lifestyle?: string;
  typology?: string;
  deliveryDate?: string;
}

const fallbackProjects: Project[] = [
  {
    id: 'velask',
    title: 'VELASK Residence',
    location: 'Antas, Porto',
    status: 'available',
    statusLabel: 'Disponível',
    strategy: 'fix-flip',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=crop&fm=webp&ixlib=rb-4.1.0&q=70&w=640',
    roi: '+25%',
    area: '334 m²',
    bedrooms: 6,
    bathrooms: 7,
    price: 'Sob consulta',
    investment: 'Sob consulta',
    timeline: 'Entrega 2026',
    description: 'Três apartamentos a estrear nas Antas (Porto).',
    landingPage: '/velask',
    estimatedRent: '€1.200/mês',
    grossYield: '5.2%',
    netYield: '4.1%',
    appreciationEstimate: '+15% em 3 anos',
    propertyType: 'ambos',
    neighborhood: 'Antas é um dos bairros mais valorizados do Porto, junto ao Estádio do Dragão e com excelentes acessos.',
    finishes: ['Cozinha equipada', 'AC pré-instalado', 'Vidros duplos', 'Jardim privado', 'Garagem'],
    nearbyAmenities: ['Metro 5 min', 'Estádio do Dragão 2 min', 'Shopping Alameda 8 min'],
    lifestyle: 'Vida urbana com espaço exterior privado.',
    typology: 'T1 a T3 Duplex',
    deliveryDate: 'Abril 2026',
  },
  {
    id: '5',
    title: 'Apartamento Vista Mar',
    location: 'Cascais',
    status: 'available',
    statusLabel: 'Disponível',
    strategy: 'buy-hold',
    image: 'https://images.unsplash.com/photo-1759150712360-6d48015e4f86?crop=entropy&cs=tinysrgb&fit=crop&fm=webp&ixlib=rb-4.1.0&q=70&w=640',
    roi: '+30%',
    area: '135 m²',
    bedrooms: 3,
    bathrooms: 2,
    price: '€595.000',
    investment: '€458.000',
    timeline: '8 meses',
    description: 'Oportunidade com vista mar e alto potencial de valorização.',
  },
];

export default function ImoveisContent() {
  const { mode, setMode } = useViewMode();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<ProjectStatus>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  useEffect(() => {
    const lgBreakpoint = parseInt(designSystem.breakpoints.lg);
    const checkMobile = () => setIsMobile(window.innerWidth < lgBreakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
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
            setProjects(data.projects);
            projectsCache.set(CACHE_KEYS.ALL_PROJECTS, data.projects);
          } else {
            setProjects(fallbackProjects);
          }
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const filters: { value: ProjectStatus; label: string }[] = useMemo(() => [
    { value: 'all', label: 'Todos' },
    { value: 'available', label: 'Disponível' },
    { value: 'in-progress', label: 'Em Andamento' },
  ], []);

  const filteredProjects = useMemo(
    () => (activeFilter === 'all' ? projects : projects.filter((p) => p.status === activeFilter)),
    [activeFilter, projects]
  );

  const handleProjectClick = useCallback(
    (id: string) => router.push(`/portfolio/${id}`),
    [router]
  );

  const subtitle = mode === 'morar'
    ? 'Encontre a sua próxima casa'
    : 'Oportunidades de investimento imobiliário';

  return (
    <>
      {/* Header */}
      <Section background="white" style={{ paddingTop: designSystem.spacing[24], paddingBottom: designSystem.spacing[8] }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mx-auto"
            style={{ maxWidth: '56rem' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                Imóveis
              </span>
            </motion.div>

            <h1
              style={{
                color: designSystem.colors.neutral[900],
                marginBottom: designSystem.spacing[4],
                fontSize: designSystem.typography.fontSize['4xl'],
                fontWeight: designSystem.typography.fontWeight.black,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Os Nossos Imóveis
            </h1>
            <p
              style={{
                color: designSystem.colors.neutral[600],
                maxWidth: '42rem',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontSize: designSystem.typography.fontSize.lg,
                marginBottom: designSystem.spacing[8],
              }}
            >
              {subtitle}
            </p>

            {/* View Mode Toggle */}
            <div className="flex justify-center" style={{ marginBottom: designSystem.spacing[6] }}>
              <ViewModeToggle mode={mode} onModeChange={setMode} />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Filters + Grid */}
      <Section background="muted">
        <Container>
          {/* Status Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center"
            style={{
              gap: designSystem.spacing[3],
              marginBottom: designSystem.spacing[10],
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
                  color: designSystem.colors.brand.primary,
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

          {/* Projects Grid */}
          {isLoadingProjects ? (
            <PortfolioGridSkeleton count={6} isMobile={isMobile} />
          ) : (
            <AnimatePresence mode="sync">
              <motion.div
                key={`${activeFilter}-${mode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                style={{ gap: designSystem.spacing[6] }}
              >
                {filteredProjects.map((project, index) => (
                  <PortfolioCard
                    key={project.id}
                    project={project as any}
                    index={index}
                    isMobile={isMobile}
                    onClick={handleProjectClick}
                    viewMode={mode}
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
              <p>Nenhum imóvel encontrado para este filtro.</p>
            </motion.div>
          )}
        </Container>
      </Section>
    </>
  );
}
