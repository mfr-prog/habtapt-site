/**
 * InsightDetailPage - Página de detalhes de artigos/insights
 * 100% Conforme Guardião Universal
 * Build: 2025-11-04T16:10:00Z - VERSÃO SIMPLIFICADA
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { motion } from 'motion/react';
import { useInView } from '../components/useInView';
import { designSystem } from '../components/design-system';
import { useRouter } from '../components/Router';
import { 
  ArrowLeft, 
  Calendar, 
  Clock,
  User,
  Share2,
  TrendingUp,
  Building2,
  Leaf,
  CheckCircle,
  ChevronRight,
} from '../components/icons';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { supabaseFetch } from '../utils/supabase/client';
import { projectsCache, CACHE_KEYS } from '../utils/projectsCache';
import { InsightDetailSkeleton } from '../components/primitives/InsightDetailSkeleton';
import { NewsletterModal } from '../components/NewsletterModal';

console.log('[InsightDetailPage] 🟢 ARQUIVO REESCRITO - Build 2025-11-04T16:10:00Z');

interface ContentBlock {
  type: 'heading2' | 'heading3' | 'paragraph' | 'list' | 'callout';
  content: string | string[];
}

interface Insight {
  id: string;
  title: string;
  description?: string;
  category: string;
  readTime: string;
  icon?: string;
  iconColor?: string;
  gradient?: string;
  author: string;
  authorRole: string;
  date: string;
  excerpt: string;
  image: string;
  tags: string[];
  content?: string | ContentBlock[];
  contentBlocks?: ContentBlock[];
  relatedInsights?: string[];
}

const categoryConfig = {
  Investimento: {
    name: 'Investimento',
    icon: TrendingUp,
    color: designSystem.colors.brand.primary,
    gradient: designSystem.colors.gradients.primary,
  },
  Regulamentação: {
    name: 'Regulamentação',
    icon: Building2,
    color: designSystem.colors.brand.accent,
    gradient: designSystem.colors.gradients.accent,
  },
  Sustentabilidade: {
    name: 'Sustentabilidade',
    icon: Leaf,
    color: designSystem.colors.brand.secondary,
    gradient: designSystem.colors.gradients.secondary,
  },
};

export function InsightDetailPage() {
  const { navigate, params } = useRouter();
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1 });
  const [insight, setInsight] = useState<Insight | null>(null);
  const [relatedInsights, setRelatedInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  console.log('[InsightDetailPage] 🔑 Params:', params);
  console.log('[InsightDetailPage] 🔍 ID solicitado:', params?.id);

  useEffect(() => {
    const fetchInsight = async () => {
      if (!params?.id) {
        console.error('[InsightDetailPage] ❌ ID não fornecido nos params');
        setIsLoading(false);
        return;
      }

      // Verificar cache primeiro
      const cached = projectsCache.get<Insight>(CACHE_KEYS.INSIGHT_BY_ID(params.id));
      if (cached) {
        console.log('[InsightDetailPage] ⚡ Using cached insight');
        setInsight(cached);
        setIsLoading(false);
        return;
      }

      try {
        console.log('[InsightDetailPage] 📡 Buscando insight ID:', params.id);
        console.log('[InsightDetailPage] 📡 Tipo do ID:', typeof params.id);
        
        const response = await supabaseFetch('/insights');
        console.log('[InsightDetailPage] 📦 Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[InsightDetailPage] 📦 Data:', data);
        
        if (data && data.success && data.insights) {
          console.log('[InsightDetailPage] 📋 Total de insights:', data.insights.length);
          console.log('[InsightDetailPage] 📋 IDs disponíveis:', data.insights.map((i: any) => ({ id: i.id, type: typeof i.id })));
          
          const foundInsight = data.insights.find((i: any) => {
            console.log('[InsightDetailPage] 🔍 Comparando:', i.id, '===', params.id, '=', i.id === params.id);
            return i.id === params.id;
          });
          
          console.log('[InsightDetailPage] 🎯 Insight encontrado:', foundInsight);
          console.log('[InsightDetailPage] 📝 Content:', foundInsight?.content);
          console.log('[InsightDetailPage] 📦 ContentBlocks:', foundInsight?.contentBlocks);
          
          if (foundInsight) {
            // Salvar no cache
            projectsCache.set(CACHE_KEYS.INSIGHT_BY_ID(params.id), foundInsight);
          }
          
          setInsight(foundInsight || null);
          
          // Buscar artigos relacionados da mesma categoria (máximo 3)
          if (foundInsight) {
            const related = data.insights
              .filter((i: any) => 
                i.id !== foundInsight.id && 
                i.category === foundInsight.category
              )
              .slice(0, 3);
            
            // Se não houver 3 artigos da mesma categoria, completar com outros
            if (related.length < 3) {
              const otherArticles = data.insights
                .filter((i: any) => 
                  i.id !== foundInsight.id && 
                  i.category !== foundInsight.category &&
                  !related.some((r: any) => r.id === i.id)
                )
                .slice(0, 3 - related.length);
              
              related.push(...otherArticles);
            }
            
            setRelatedInsights(related);
          }
        }
      } catch (error) {
        console.error('[InsightDetailPage] ❌ Erro:', error);
        setInsight(null);
      }
      
      setIsLoading(false);
    };

    fetchInsight();
  }, [params?.id]);

  useEffect(() => {
    const mdBreakpoint = parseInt(designSystem.breakpoints.md);
    const checkMobile = () => setIsMobile(window.innerWidth < mdBreakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Verifica se o artigo está salvo
    if (insight) {
      const savedInsights = JSON.parse(localStorage.getItem('savedInsights') || '[]');
      setIsSaved(savedInsights.includes(insight.id));
    }
  }, [insight]);

  console.log('[InsightDetailPage] 🔄 Render state:', { isLoading, hasInsight: !!insight });

  if (isLoading) {
    console.log('[InsightDetailPage] ⏳ Loading...');
    return (
      <Section background="white" style={{ paddingTop: '7.5rem', minHeight: '100vh' }}>
        <Container>
          <InsightDetailSkeleton />
        </Container>
      </Section>
    );
  }

  if (!insight) {
    console.log('[InsightDetailPage] ❌ Insight não encontrado');
    return (
      <Section background="white" style={{ paddingTop: '7.5rem', minHeight: '60vh' }}>
        <Container>
          <div className="text-center">
            <h1 style={{ marginBottom: designSystem.spacing[4] }}>
              Artigo não encontrado
            </h1>
            <p style={{ fontSize: '1.125rem', color: designSystem.colors.neutral[600], marginBottom: designSystem.spacing[8] }}>
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <motion.button
              onClick={() => navigate('insights')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
                background: designSystem.colors.gradients.primary,
                color: designSystem.colors.neutral.white,
                border: 'none',
                borderRadius: designSystem.borderRadius.lg,
                cursor: 'pointer',
                fontWeight: designSystem.typography.fontWeight.semibold,
              }}
            >
              Voltar aos Insights
            </motion.button>
          </div>
        </Container>
      </Section>
    );
  }

  console.log('[InsightDetailPage] ✅ Renderizando insight:', insight.title);

  const category = categoryConfig[insight.category as keyof typeof categoryConfig] || categoryConfig.Investimento;
  const CategoryIcon = category?.icon || TrendingUp;

  // Função para compartilhar
  const handleShare = () => {
    setShowShareModal(true);
    setShareLinkCopied(false);
  };

  // Função para copiar o link usando método alternativo
  const copyShareLink = () => {
    const link = window.location.href;
    
    // Método 1: Tentar usar clipboard API se disponível
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link)
        .then(() => {
          setShareLinkCopied(true);
          setTimeout(() => setShareLinkCopied(false), 3000);
        })
        .catch(() => {
          // Se falhar, usar método de seleção
          fallbackCopyTextToClipboard(link);
        });
    } else {
      // Método fallback: criar elemento temporário
      fallbackCopyTextToClipboard(link);
    }
  };

  // Método fallback para copiar texto
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setShareLinkCopied(true);
      setTimeout(() => setShareLinkCopied(false), 3000);
    } catch (err) {
      console.error('Fallback: Erro ao copiar', err);
    }
    
    document.body.removeChild(textArea);
  };



  // Função para renderizar o conteúdo
  const renderContent = () => {
    console.log('[InsightDetailPage] 🎨 renderContent chamado');
    console.log('[InsightDetailPage] 📦 contentBlocks:', insight.contentBlocks);
    console.log('[InsightDetailPage] 📝 content:', insight.content);
    console.log('[InsightDetailPage] 📝 content type:', typeof insight.content);

    // Se tiver contentBlocks (array estruturado)
    if (insight.contentBlocks && Array.isArray(insight.contentBlocks)) {
      console.log('[InsightDetailPage] ✅ Usando contentBlocks');
      return renderStructuredContent(insight.contentBlocks);
    }

    // Se tiver content como array
    if (Array.isArray(insight.content)) {
      console.log('[InsightDetailPage] ✅ Usando content como array');
      return renderStructuredContent(insight.content);
    }

    // Se tiver content como string
    if (typeof insight.content === 'string' && insight.content) {
      console.log('[InsightDetailPage] ✅ Usando content como string');
      const paragraphs = insight.content.split('\n\n').filter(p => p.trim());
      console.log('[InsightDetailPage] 📄 Parágrafos encontrados:', paragraphs.length);

      if (paragraphs.length > 0) {
        return (
          <div style={{
            fontSize: '1.0625rem',
            lineHeight: '1.8',
            color: designSystem.colors.neutral[700],
          }}>
            {paragraphs.map((paragraph, idx) => (
              <p 
                key={idx}
                style={{
                  marginBottom: designSystem.spacing[6],
                  textAlign: 'justify',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        );
      }
    }

    // Fallback
    console.warn('[InsightDetailPage] ⚠️ Nenhum conteúdo encontrado');
    return (
      <p style={{ 
        color: designSystem.colors.neutral[500],
        fontStyle: 'italic',
        padding: designSystem.spacing[8],
        textAlign: 'center',
      }}>
        Conteúdo não disponível.
      </p>
    );
  };

  // Função para renderizar conteúdo estruturado
  const renderStructuredContent = (blocks: ContentBlock[]) => {
    console.log('[InsightDetailPage] 🎨 renderStructuredContent - blocks:', blocks.length);
    
    try {
      return blocks.map((block, index) => {
        console.log('[InsightDetailPage] 🔨 Renderizando block', index, '- type:', block.type);
        
        switch (block.type) {
        case 'heading2':
          return (
            <h2 key={index} style={{
              fontSize: '1.875rem',
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginTop: index === 0 ? '0' : designSystem.spacing[12],
              marginBottom: designSystem.spacing[4],
            }}>
              {block.content as string}
            </h2>
          );

        case 'heading3':
          return (
            <h3 key={index} style={{
              fontSize: '1.5rem',
              fontWeight: designSystem.typography.fontWeight.bold,
              color: designSystem.colors.brand.primary,
              marginTop: designSystem.spacing[8],
              marginBottom: designSystem.spacing[3],
            }}>
              {block.content as string}
            </h3>
          );

        case 'paragraph':
          return (
            <p key={index} style={{
              fontSize: '1.0625rem',
              lineHeight: '1.8',
              color: designSystem.colors.neutral[700],
              marginBottom: designSystem.spacing[6],
              textAlign: 'justify',
            }}>
              {block.content as string}
            </p>
          );

        case 'list':
          return (
            <ul key={index} style={{
              listStyle: 'none',
              padding: 0,
              marginBottom: designSystem.spacing[8],
            }}>
              {(block.content as string[]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3" style={{
                  marginBottom: designSystem.spacing[3],
                }}>
                  <CheckCircle 
                    size={20} 
                    style={{ 
                      color: category.color,
                      flexShrink: 0,
                      marginTop: '0.25rem',
                    }} 
                  />
                  <span style={{
                    fontSize: '1.0625rem',
                    lineHeight: '1.7',
                    color: designSystem.colors.neutral[700],
                  }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          );

        case 'callout':
          return (
            <div key={index} style={{
              padding: designSystem.spacing[6],
              background: `${category.color}08`,
              borderLeft: `4px solid ${category.color}`,
              borderRadius: designSystem.borderRadius.lg,
              marginBottom: designSystem.spacing[8],
            }}>
              <p style={{
                fontSize: '1.0625rem',
                color: designSystem.colors.brand.primary,
                fontWeight: designSystem.typography.fontWeight.medium,
                margin: 0,
                fontStyle: 'italic',
              }}>
                {block.content as string}
              </p>
            </div>
          );

        default:
          console.warn('[InsightDetailPage] ⚠️ Tipo de bloco desconhecido:', block.type);
          return null;
      }
    });
    } catch (error) {
      console.error('[InsightDetailPage] ❌ Erro ao renderizar contentBlocks:', error);
      return (
        <p style={{ 
          color: designSystem.colors.neutral[500],
          fontStyle: 'italic',
          padding: designSystem.spacing[8],
          textAlign: 'center',
        }}>
          Erro ao carregar conteúdo: {String(error)}
        </p>
      );
    }
  };

  return (
    <>
      <Section background="white" style={{ paddingTop: '100px', paddingBottom: '0' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: designSystem.spacing[6] }}
          >
            <button
              onClick={() => navigate('insights')}
              className="flex items-center gap-2 group"
              style={{
                background: 'transparent',
                border: 'none',
                color: designSystem.colors.brand.primary,
                cursor: 'pointer',
                padding: `${designSystem.spacing[2]} 0`,
                fontWeight: designSystem.typography.fontWeight.semibold,
              }}
            >
              <ArrowLeft 
                size={20} 
                className="group-hover:-translate-x-1 transition-transform duration-300" 
              />
              Voltar aos Insights
            </button>
          </motion.div>

          <div ref={sectionRef}>
            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginBottom: designSystem.spacing[6] }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  padding: `${designSystem.spacing[2]} ${designSystem.spacing[4]}`,
                  background: category.gradient,
                  color: designSystem.colors.neutral.white,
                  borderRadius: designSystem.borderRadius.full,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  fontSize: '0.875rem',
                }}
              >
                <CategoryIcon size={16} />
                {category.name}
              </div>

              {insight.tags?.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: `${designSystem.spacing[1]} ${designSystem.spacing[3]}`,
                    background: designSystem.colors.neutral[100],
                    color: designSystem.colors.neutral[700],
                    borderRadius: designSystem.borderRadius.full,
                    fontSize: '0.875rem',
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                marginBottom: designSystem.spacing[6],
                color: designSystem.colors.brand.primary,
              }}
            >
              {insight.title}
            </motion.h1>

            <motion.div
              className="flex flex-wrap items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                marginBottom: designSystem.spacing[8],
                paddingBottom: designSystem.spacing[8],
                borderBottom: `2px solid ${designSystem.colors.neutral[200]}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: category.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: designSystem.colors.neutral.white,
                  fontWeight: designSystem.typography.fontWeight.bold,
                  fontSize: '1.25rem',
                }}>
                  {insight.author.charAt(0)}
                </div>
                <div>
                  <p style={{
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.neutral[900],
                    marginBottom: '0.125rem',
                  }}>
                    {insight.author}
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: designSystem.colors.neutral[600],
                  }}>
                    {insight.authorRole}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1" style={{ color: designSystem.colors.neutral[600] }}>
                <Calendar size={16} />
                <span style={{ fontSize: '0.875rem' }}>{insight.date}</span>
              </div>

              <div className="flex items-center gap-1" style={{ color: designSystem.colors.neutral[600] }}>
                <Clock size={16} />
                <span style={{ fontSize: '0.875rem' }}>{insight.readTime}</span>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 group"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: designSystem.colors.neutral[600],
                    cursor: 'pointer',
                    padding: designSystem.spacing[2],
                  }}
                >
                  <Share2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span style={{ fontSize: '0.875rem' }}>Compartilhar</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              style={{
                marginBottom: designSystem.spacing[12],
                borderRadius: designSystem.borderRadius['2xl'],
                overflow: 'hidden',
                boxShadow: designSystem.shadows.lg,
              }}
            >
              <ImageWithFallback
                src={insight.image}
                alt={insight.title}
                style={{
                  width: '100%',
                  height: isMobile ? '250px' : '500px',
                  objectFit: 'cover',
                }}
              />
            </motion.div>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {renderContent()}
            </motion.article>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                marginTop: designSystem.spacing[12],
                padding: designSystem.spacing[8],
                background: designSystem.colors.neutral[50],
                borderRadius: designSystem.borderRadius['2xl'],
                textAlign: 'center',
              }}
            >
              <h3 style={{
                color: designSystem.colors.brand.primary,
                marginBottom: designSystem.spacing[4],
              }}>
                Gostou deste artigo?
              </h3>
              <p style={{
                color: designSystem.colors.neutral[600],
                marginBottom: designSystem.spacing[6],
              }}>
                Compartilhe com quem também se interessa por reabilitação urbana e investimento imobiliário.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
                    background: designSystem.colors.gradients.primary,
                    color: designSystem.colors.neutral.white,
                    border: 'none',
                    borderRadius: designSystem.borderRadius.lg,
                    cursor: 'pointer',
                    fontWeight: designSystem.typography.fontWeight.semibold,
                  }}
                >
                  Compartilhar
                </motion.button>
              </div>
            </motion.div>

            {/* Newsletter CTA - Discreto e contextual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
              style={{
                marginTop: designSystem.spacing[8],
              }}
            >
              <p
                style={{
                  color: designSystem.colors.neutral[500],
                  fontSize: designSystem.typography.fontSize.sm,
                }}
              >
                Gostou do conteúdo?{' '}
                <button
                  onClick={() => setIsNewsletterOpen(true)}
                  style={{
                    color: designSystem.colors.brand.secondary,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: designSystem.animations.transition.base,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = designSystem.colors.brand.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = designSystem.colors.brand.secondary;
                  }}
                  aria-label="Abrir formulário de subscrição da newsletter"
                >
                  Receba mais insights por email
                </button>
              </p>
            </motion.div>
          </div>
        </Container>
      </Section>

      {relatedInsights.length > 0 && (
        <Section background="neutral.50" style={{ paddingTop: designSystem.spacing[16], paddingBottom: designSystem.spacing[16] }}>
          <Container>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: designSystem.spacing[12] }}
              >
                <h2 style={{ color: designSystem.colors.brand.primary, marginBottom: designSystem.spacing[4] }}>
                  Artigos Relacionados
                </h2>
                <p style={{ fontSize: '1.125rem', color: designSystem.colors.neutral[600] }}>
                  Continue aprendendo sobre reabilitação urbana e investimento imobiliário
                </p>
              </motion.div>

              <motion.div
                className="grid gap-8"
                style={{
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {relatedInsights.map((related, index) => {
                  const relatedCategory = categoryConfig[related.category as keyof typeof categoryConfig] || categoryConfig.Investimento;
                  const RelatedIcon = relatedCategory.icon;

                  return (
                    <motion.div
                      key={related.id}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => navigate('insight-detail', { id: related.id })}
                      className="group cursor-pointer"
                      style={{
                        background: designSystem.colors.neutral.white,
                        borderRadius: designSystem.borderRadius['2xl'],
                        overflow: 'hidden',
                        boxShadow: designSystem.shadows.md,
                      }}
                    >
                      <div style={{ position: 'relative', overflow: 'hidden', height: '200px' }}>
                        <ImageWithFallback
                          src={related.image}
                          alt={related.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                          className="group-hover:scale-110"
                        />
                        <div
                          className="flex items-center gap-2"
                          style={{
                            position: 'absolute',
                            top: designSystem.spacing[4],
                            left: designSystem.spacing[4],
                            padding: `${designSystem.spacing[2]} ${designSystem.spacing[3]}`,
                            background: relatedCategory.gradient,
                            color: designSystem.colors.neutral.white,
                            borderRadius: designSystem.borderRadius.full,
                            fontSize: '0.75rem',
                            fontWeight: designSystem.typography.fontWeight.bold,
                          }}
                        >
                          <RelatedIcon size={14} />
                          {relatedCategory.name}
                        </div>
                      </div>

                      <div style={{ padding: designSystem.spacing[6] }}>
                        <h3 style={{
                          color: designSystem.colors.brand.primary,
                          marginBottom: designSystem.spacing[3],
                          transition: 'color 0.3s ease',
                        }}
                        className="group-hover:text-opacity-80">
                          {related.title}
                        </h3>
                        <p style={{
                          fontSize: '0.9375rem',
                          color: designSystem.colors.neutral[600],
                          lineHeight: '1.6',
                          marginBottom: designSystem.spacing[4],
                        }}>
                          {related.excerpt}
                        </p>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock size={14} style={{ color: designSystem.colors.neutral[500] }} />
                            <span style={{ color: designSystem.colors.neutral[600], fontSize: '0.875rem' }}>
                              {related.readTime}
                            </span>
                          </div>
                          <span
                            className="flex items-center gap-1.5 ml-auto group-hover:gap-2.5 transition-all duration-300"
                            style={{
                              color: designSystem.colors.brand.primary,
                              fontWeight: designSystem.typography.fontWeight.semibold,
                              fontSize: '0.875rem',
                            }}
                          >
                            Ler artigo
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </Container>
        </Section>
      )}

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <div
          onClick={() => setShowShareModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: designSystem.spacing[4],
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: designSystem.colors.neutral.white,
              borderRadius: designSystem.borderRadius['2xl'],
              padding: designSystem.spacing[8],
              maxWidth: '500px',
              width: '100%',
              boxShadow: designSystem.shadows['2xl'],
            }}
          >
            <div style={{ marginBottom: designSystem.spacing[6] }}>
              <h3 style={{
                color: designSystem.colors.brand.primary,
                marginBottom: designSystem.spacing[2],
              }}>
                Compartilhar Artigo
              </h3>
              <p style={{
                fontSize: '0.9375rem',
                color: designSystem.colors.neutral[600],
              }}>
                Copie o link abaixo para compartilhar este artigo
              </p>
            </div>

            <div style={{
              padding: designSystem.spacing[4],
              background: designSystem.colors.neutral[50],
              borderRadius: designSystem.borderRadius.lg,
              marginBottom: designSystem.spacing[6],
              border: `2px solid ${designSystem.colors.neutral[200]}`,
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: designSystem.colors.neutral[700],
                wordBreak: 'break-all',
                margin: 0,
              }}>
                {window.location.href}
              </p>
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={copyShareLink}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
                  background: shareLinkCopied 
                    ? designSystem.colors.brand.secondary 
                    : designSystem.colors.gradients.primary,
                  color: designSystem.colors.neutral.white,
                  border: 'none',
                  borderRadius: designSystem.borderRadius.lg,
                  cursor: 'pointer',
                  fontWeight: designSystem.typography.fontWeight.semibold,
                }}
              >
                {shareLinkCopied ? '✓ Copiado!' : 'Copiar Link'}
              </motion.button>
              
              <motion.button
                onClick={() => setShowShareModal(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
                  background: designSystem.colors.neutral[200],
                  color: designSystem.colors.neutral[700],
                  border: 'none',
                  borderRadius: designSystem.borderRadius.lg,
                  cursor: 'pointer',
                  fontWeight: designSystem.typography.fontWeight.semibold,
                }}
              >
                Fechar
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Newsletter Modal */}
      <NewsletterModal isOpen={isNewsletterOpen} onClose={() => setIsNewsletterOpen(false)} />
    </>
  );
}

// Export default para compatibilidade
export default InsightDetailPage;