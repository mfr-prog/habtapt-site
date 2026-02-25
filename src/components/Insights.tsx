'use client';

// Insights Component - v3.0.0 - Otimizado para Performance
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { BookOpen, TrendingUp, Building2, Leaf } from './icons';
import { motion } from 'motion/react';
import { useInView } from './useInView';
import { designSystem } from './design-system';
import { useRouter } from 'next/navigation';
import { NewsletterModal } from './NewsletterModal';
import { supabaseFetch } from '../utils/supabase/client';
import { projectsCache, CACHE_KEYS } from '../utils/projectsCache';
import { InsightCard } from './primitives/InsightCard';
import { InsightsGridSkeleton } from './primitives/InsightsGridSkeleton';

interface Insight {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  category: string;
  readTime: string;
  gradient?: string;
  iconColor?: string;
}

export function Insights() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [articles, setArticles] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Fallback insights
  const fallbackInsights: Insight[] = useMemo(
    () => [
      {
        id: '1',
        icon: TrendingUp,
        title: 'Como avaliar o potencial de valorização de um imóvel urbano',
        description:
          'Aprenda os principais indicadores técnicos e de mercado para identificar oportunidades de alta rentabilidade na reabilitação urbana.',
        category: 'Investimento',
        readTime: '5 min',
        gradient: designSystem.colors.gradients.primary,
        iconColor: designSystem.colors.brand.primary,
      },
      {
        id: '2',
        icon: Building2,
        title: 'O impacto das zonas ARU na rentabilidade',
        description:
          'Entenda como as Áreas de Reabilitação Urbana influenciam os incentivos fiscais e aumentam o retorno de investimento em projetos imobiliários.',
        category: 'Regulamentação',
        readTime: '7 min',
        gradient: designSystem.colors.gradients.secondary,
        iconColor: designSystem.colors.brand.secondary,
      },
      {
        id: '3',
        icon: Leaf,
        title: 'Reabilitação sustentável: o futuro do mercado imobiliário',
        description:
          'Descubra como a sustentabilidade e eficiência energética estão transformando o setor de reabilitação e agregando valor aos imóveis.',
        category: 'Sustentabilidade',
        readTime: '6 min',
        gradient: designSystem.colors.gradients.accent,
        iconColor: designSystem.colors.brand.accent,
      },
    ],
    []
  );

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

  // Fetch insights com cache
  useEffect(() => {
    const fetchInsights = async () => {
      // Verificar cache primeiro
      const cached = projectsCache.get<Insight[]>(CACHE_KEYS.INSIGHTS);
      if (cached) {
        console.log('[Insights] ⚡ Using cached insights');
        setArticles(cached);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('[Insights] Fetching insights from server...');
        const response = await supabaseFetch('insights');

        if (!response.ok) {
          console.warn('[Insights] Server response not OK:', response.status);
          throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();
        console.log('[Insights] Received data:', data);

        // Map server data to component format
        const mappedInsights = (data.insights || []).map((insight: any) => {
          let IconComponent = TrendingUp;
          if (insight.icon === 'Building2') IconComponent = Building2;
          else if (insight.icon === 'Leaf') IconComponent = Leaf;
          else if (insight.icon === 'BookOpen') IconComponent = BookOpen;

          return {
            id: insight.id,
            icon: IconComponent,
            title: insight.title,
            description: insight.description,
            category: insight.category,
            readTime: insight.readTime,
            gradient: insight.gradient,
            iconColor: insight.iconColor,
          };
        });

        if (mappedInsights.length > 0) {
          console.log('[Insights] ✅ Loaded insights:', mappedInsights.length);
          setArticles(mappedInsights);
          
          // Salvar no cache
          projectsCache.set(CACHE_KEYS.INSIGHTS, mappedInsights);
        } else {
          console.log('[Insights] ℹ️ No insights from server, using fallback');
          setArticles(fallbackInsights);
        }
      } catch (error) {
        console.error('[Insights] ❌ Error fetching insights:', error);
        setArticles(fallbackInsights);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [fallbackInsights]);

  // Handler memoizado
  const handleInsightClick = useCallback(
    (id: string) => {
      router.push(`/blog/${id}`);
    },
    [router]
  );

  // Categorias para filtros
  const categories = useMemo(() => [
    { value: 'all', label: 'Todos', icon: BookOpen, color: designSystem.colors.brand.primary },
    { value: 'Investimento', label: 'Investimento', icon: TrendingUp, color: designSystem.colors.brand.primary },
    { value: 'Regulamentação', label: 'Regulamentação', icon: Building2, color: designSystem.colors.brand.accent },
    { value: 'Sustentabilidade', label: 'Sustentabilidade', icon: Leaf, color: designSystem.colors.brand.secondary },
    { value: 'Mercado', label: 'Mercado', icon: TrendingUp, color: designSystem.colors.brand.tertiary },
  ], []);

  // Filtrar artigos por categoria
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return articles;
    return articles.filter(article => article.category === activeCategory);
  }, [articles, activeCategory]);

  return (
    <Section id="insights" background={designSystem.colors.neutral[50]}>
      <Container>
        <section aria-labelledby="insights-title">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 rounded-full mb-6"
              style={{
                paddingTop: designSystem.spacing[3],
                paddingBottom: designSystem.spacing[3],
                background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.08),
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.15)}`,
              }}
            >
              <BookOpen size={18} style={{ color: designSystem.colors.brand.secondary }} />
              <span
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  color: designSystem.colors.brand.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: designSystem.typography.letterSpacing.wider,
                }}
              >
                Insights & Mercado
              </span>
            </motion.div>

            <h2
              id="insights-title"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: designSystem.typography.fontWeight.black,
                color: designSystem.colors.brand.primary,
                marginBottom: designSystem.spacing[6],
                letterSpacing: designSystem.typography.letterSpacing.tight,
                lineHeight: designSystem.typography.lineHeight.tight,
              }}
            >
              Insights & Mercado
            </h2>

            <p
              className="max-w-2xl mx-auto"
              style={{
                fontSize: designSystem.typography.fontSize.lg,
                color: designSystem.colors.neutral[600],
                lineHeight: designSystem.typography.lineHeight.relaxed,
              }}
            >
              Conhecimento e visão sobre reabilitação urbana e investimento imobiliário em Portugal.
            </p>
          </motion.div>

          {/* Filtros por Categoria */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: designSystem.spacing[3],
              marginBottom: designSystem.spacing[12],
            }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.value;
              
              return (
                <motion.button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: designSystem.spacing[2],
                    padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
                    background: isActive ? category.color : designSystem.colors.neutral.white,
                    color: isActive ? designSystem.colors.neutral.white : category.color,
                    border: `2px solid ${category.color}`,
                    borderRadius: designSystem.borderRadius.full,
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? designSystem.shadows.md : 'none',
                  }}
                >
                  <Icon size={18} />
                  {category.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Articles Grid with Skeleton */}
          {isLoading ? (
            <InsightsGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredArticles.map((article, index) => (
                <InsightCard
                  key={article.id}
                  insight={article}
                  index={index}
                  isMobile={isMobile}
                  onClick={handleInsightClick}
                />
              ))}
            </div>
          )}

          {/* Newsletter CTA - Seção Destacada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              marginTop: designSystem.spacing[16],
              padding: isMobile ? designSystem.spacing[8] : designSystem.spacing[12],
              background: designSystem.colors.gradients.heroLuxury,
              borderRadius: designSystem.borderRadius['3xl'],
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative glow */}
            <div
              style={{
                position: 'absolute',
                top: '-50%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80%',
                height: '200%',
                background: designSystem.colors.gradients.secondary,
                filter: 'blur(100px)',
                opacity: 0.15,
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{
                  width: '64px',
                  height: '64px',
                  background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.15),
                  borderRadius: designSystem.borderRadius.full,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: designSystem.spacing[6],
                  backdropFilter: 'blur(10px)',
                }}
              >
                <BookOpen size={32} style={{ color: designSystem.colors.neutral.white }} />
              </motion.div>

              <h3
                style={{
                  color: designSystem.colors.neutral.white,
                  marginBottom: designSystem.spacing[4],
                  fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : designSystem.typography.fontSize['3xl'],
                }}
              >
                Receba Insights Exclusivos
              </h3>
              
              <p
                style={{
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9),
                  fontSize: designSystem.typography.fontSize.lg,
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                  marginBottom: designSystem.spacing[8],
                  maxWidth: '600px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Análises de mercado, tendências de investimento e oportunidades em reabilitação urbana direto no seu email.
              </p>

              <motion.button
                onClick={() => setIsNewsletterOpen(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: `${designSystem.spacing[5]} ${designSystem.spacing[10]}`,
                  background: designSystem.colors.neutral.white,
                  color: designSystem.colors.brand.primary,
                  borderRadius: designSystem.borderRadius.full,
                  fontWeight: designSystem.typography.fontWeight.bold,
                  fontSize: designSystem.typography.fontSize.base,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: designSystem.shadows.xl,
                }}
              >
                Subscrever Newsletter
              </motion.button>
            </div>
          </motion.div>
        </section>
      </Container>

      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </Section>
  );
}