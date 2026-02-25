'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { designSystem } from '@/components/design-system';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, TrendingUp,
  Ruler, Bed, Bath, Clock, Calendar, Home, DollarSign, Check, Award, Phone, MessageSquare, ArrowRight
} from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useProjectFetch, Project } from '@/utils/hooks/useProjectFetch';
import { supabaseFetch } from '@/utils/supabase/client';
import { StatusBadge, StrategyBadge } from '@/components/primitives/Badge';
import { ProjectDetailSkeleton } from '@/components/primitives/ProjectDetailSkeleton';
import { ExternalLinksCard } from '@/components/primitives/ExternalLinksCard';

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Renovação Chiado Premium',
    location: 'Chiado, Lisboa',
    status: 'sold',
    strategy: 'fix-flip',
    investment: '€450.000',
    roi: '+35%',
    duration: '8 meses',
    area: '180m²',
    bedrooms: 3,
    bathrooms: 2,
    year: '2024',
    forSale: false,
    salePrice: null,
    portalLink: 'https://www.idealista.pt',
    brochureLink: null,
    type: 'Apartamento',
    description: 'Reabilitação completa de edifício histórico no coração do Chiado, mantendo as características arquitetónicas originais e adicionando comodidades modernas.',
    highlights: [
      'Restauro de fachada histórica em azulejos',
      'Preservação de elementos arquitetónicos originais',
      'Sistema de climatização eficiente',
      'Cozinha e casas de banho de design premium',
      'Certificação energética A',
      'Localização prime no Chiado',
    ],
    timeline: [
      { phase: 'Aquisição e Due Diligence', duration: '1 mês', status: 'completed' },
      { phase: 'Projeto e Licenciamento', duration: '2 meses', status: 'completed' },
      { phase: 'Obras de Reabilitação', duration: '4 meses', status: 'completed' },
      { phase: 'Acabamentos Finais', duration: '1 mês', status: 'completed' },
    ],
    financials: {
      acquisition: '€350.000',
      renovation: '€100.000',
      total: '€450.000',
      sale: '€620.000',
      profit: '€170.000',
      roi: '+35%',
    },
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  },
];

export default function PortfolioDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [isMobile, setIsMobile] = useState(false);

  const { project, isLoading, error } = useProjectFetch(id, {
    mockData: projectsData,
    onError: (err) => {
      console.error('Erro ao carregar projeto:', err);
    }
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <Section>
        <Container>
          <div style={{ textAlign: 'center', padding: designSystem.spacing[16] }}>
            <h1 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[4] }}>
              Projeto não encontrado
            </h1>
            <Button onClick={() => router.push('/portfolio')}>
              <ArrowLeft size={20} />
              Voltar ao Portfólio
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <div ref={ref}>
      {/* Back Button */}
      <Section background="white" style={{ paddingTop: designSystem.spacing[8], paddingBottom: 0 }}>
        <Container>
          <Button
            variant="ghost"
            onClick={() => router.push('/portfolio')}
            style={{ marginBottom: designSystem.spacing[6] }}
          >
            <ArrowLeft size={20} />
            Voltar ao Portfólio
          </Button>
        </Container>
      </Section>

      {/* Hero com 1 Imagem */}
      <Section background="white" style={{ paddingTop: designSystem.spacing[4], paddingBottom: designSystem.spacing[isMobile ? 8 : 12] }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Imagem Principal */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: isMobile ? '280px' : '500px',
                borderRadius: designSystem.borderRadius['2xl'],
                overflow: 'hidden',
                marginBottom: designSystem.spacing[6],
              }}
            >
              <ImageWithFallback
                src={project.image}
                alt={project.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: designSystem.spacing[4],
                  left: designSystem.spacing[4],
                  right: designSystem.spacing[4],
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  gap: designSystem.spacing[2],
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: designSystem.spacing[2],
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-end' : 'flex-start',
                  }}
                >
                  <StatusBadge status={project.status} size="lg" />
                  <StrategyBadge strategy={project.strategy} size="lg" />
                </div>
              </div>
            </div>

            {/* Título e Localização */}
            <div style={{ marginBottom: designSystem.spacing[6] }}>
              <h1
                style={{
                  color: designSystem.colors.neutral[900],
                  marginBottom: designSystem.spacing[2],
                  fontSize: isMobile ? designSystem.typography.fontSize['3xl'] : undefined,
                }}
              >
                {project.title}
              </h1>
              <div
                className="inline-flex items-center gap-2"
                style={{
                  color: designSystem.colors.neutral[600],
                  fontSize: designSystem.typography.fontSize.lg,
                }}
              >
                <MapPin size={isMobile ? 18 : 20} />
                <span>{project.location}</span>
              </div>
            </div>

            {/* Grid de Métricas Principais */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: designSystem.spacing[4],
                marginBottom: designSystem.spacing[8],
              }}
            >
              <MetricCard icon={<Ruler size={24} />} label="Área" value={project.area} />
              <MetricCard icon={<TrendingUp size={24} />} label="ROI" value={project.roi} highlight />
              <MetricCard icon={<Clock size={24} />} label="Duração" value={project.duration} />
              <MetricCard icon={<Home size={24} />} label="Tipo" value={project.type} />
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Descrição e Características */}
      <Section background="muted">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
              gap: designSystem.spacing[8],
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {project.description && (
                <div style={{ marginBottom: designSystem.spacing[8] }}>
                  <h2 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[4], fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : undefined }}>
                    Sobre o Projeto
                  </h2>
                  <p style={{ color: designSystem.colors.neutral[700], fontSize: designSystem.typography.fontSize.lg, lineHeight: designSystem.typography.lineHeight.relaxed }}>
                    {project.description}
                  </p>
                </div>
              )}

              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h2 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[4], fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : undefined }}>
                    Principais Destaques
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: designSystem.spacing[3] }}>
                    {project.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="inline-flex items-start gap-3"
                        style={{ padding: designSystem.spacing[4], background: designSystem.colors.neutral.white, borderRadius: designSystem.borderRadius.lg, boxShadow: designSystem.shadows.sm }}
                      >
                        <div style={{ minWidth: '24px', height: '24px', borderRadius: designSystem.borderRadius.full, background: `${designSystem.colors.brand.secondary}15`, color: designSystem.colors.brand.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={16} />
                        </div>
                        <span style={{ color: designSystem.colors.neutral[700], fontSize: designSystem.typography.fontSize.sm, lineHeight: designSystem.typography.lineHeight.relaxed }}>
                          {highlight}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div style={{ background: designSystem.colors.neutral.white, padding: designSystem.spacing[6], borderRadius: designSystem.borderRadius.xl, boxShadow: designSystem.shadows.md, position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : designSystem.spacing[24] }}>
                <h3 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[6], fontSize: isMobile ? designSystem.typography.fontSize.xl : undefined }}>
                  Características
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[4] }}>
                  <CharacteristicRow icon={<Bed size={20} />} label="Quartos" value={`${project.bedrooms}`} />
                  <CharacteristicRow icon={<Bath size={20} />} label="Casas de Banho" value={`${project.bathrooms}`} />
                  <CharacteristicRow icon={<Ruler size={20} />} label="Área Total" value={project.area} />
                  <CharacteristicRow icon={<Home size={20} />} label="Tipo" value={project.type} />
                  <CharacteristicRow icon={<Calendar size={20} />} label="Ano" value={project.year} />
                  <CharacteristicRow icon={<Clock size={20} />} label="Duração" value={project.duration} />
                </div>

                {project.forSale && (
                  <div style={{ marginTop: designSystem.spacing[6], paddingTop: designSystem.spacing[6], borderTop: `1px solid ${designSystem.colors.neutral[200]}` }}>
                    <div style={{ textAlign: 'center', marginBottom: designSystem.spacing[4] }}>
                      <div style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600], marginBottom: designSystem.spacing[1] }}>Preço de Venda</div>
                      <div style={{ fontSize: designSystem.typography.fontSize['2xl'], fontWeight: designSystem.typography.fontWeight.bold, color: designSystem.colors.brand.secondary }}>{project.salePrice}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      {project.timeline && project.timeline.length > 0 && (
        <Section background="white">
          <Container>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[4], textAlign: isMobile ? 'left' : 'center', fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : undefined }}>
                Fases do Projeto
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${project.timeline.length}, 1fr)`, gap: designSystem.spacing[4] }}>
                {project.timeline.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    style={{
                      padding: designSystem.spacing[5],
                      background: phase.status === 'completed' ? `${designSystem.colors.brand.secondary}05` : designSystem.colors.neutral[50],
                      border: `2px solid ${phase.status === 'completed' ? designSystem.colors.brand.secondary : designSystem.colors.neutral[200]}`,
                      borderRadius: designSystem.borderRadius.xl,
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '32px', borderRadius: designSystem.borderRadius.full, background: phase.status === 'completed' ? designSystem.colors.brand.secondary : designSystem.colors.neutral.white, color: phase.status === 'completed' ? designSystem.colors.neutral.white : designSystem.colors.neutral[600], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: designSystem.typography.fontWeight.bold, fontSize: designSystem.typography.fontSize.sm, border: `2px solid ${phase.status === 'completed' ? designSystem.colors.brand.secondary : designSystem.colors.neutral[300]}` }}>
                      {index + 1}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: designSystem.spacing[3] }}>
                      <div style={{ fontSize: designSystem.typography.fontSize.sm, fontWeight: designSystem.typography.fontWeight.semibold, color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[2] }}>{phase.phase}</div>
                      <div style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.neutral[600] }}>{phase.duration}</div>
                    </div>
                    {phase.status === 'completed' && (
                      <div style={{ position: 'absolute', bottom: designSystem.spacing[2], right: designSystem.spacing[2], width: '20px', height: '20px', borderRadius: designSystem.borderRadius.full, background: designSystem.colors.brand.secondary, color: designSystem.colors.neutral.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Dados Financeiros */}
      {project.financials && (
        <Section background="muted">
          <Container>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <h2 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[4], textAlign: isMobile ? 'left' : 'center', fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : undefined }}>
                Dados Financeiros
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: designSystem.spacing[6] }}>
                <FinancialMetricCard label="Investimento Total" value={project.financials.total} breakdown={[{ label: 'Aquisição', value: project.financials.acquisition }, { label: 'Renovação', value: project.financials.renovation }]} />
                <FinancialMetricCard label="Valor de Venda" value={project.financials.sale} highlight />
                <FinancialMetricCard label="Lucro Líquido" value={project.financials.profit} subtitle={`ROI: ${project.financials.roi}`} success />
              </div>
              <ExternalLinksCard portalLink={project.portalLink} brochureLink={project.brochureLink} animated={true} delay={0.3} isMobile={isMobile} />
            </motion.div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section background="white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ background: designSystem.colors.gradients.heroSubtle, borderRadius: designSystem.borderRadius['3xl'], padding: isMobile ? designSystem.spacing[8] : designSystem.spacing[12], textAlign: 'center', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: '-50%', right: '-25%', width: '50%', height: '200%', background: designSystem.colors.gradients.secondary, filter: 'blur(80px)', opacity: 0.2, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ color: designSystem.colors.neutral.white, marginBottom: designSystem.spacing[4], fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : undefined }}>
                Interessado neste projeto?
              </h3>
              <p style={{ color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.9), fontSize: designSystem.typography.fontSize.lg, lineHeight: designSystem.typography.lineHeight.relaxed, marginBottom: designSystem.spacing[8], maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                Entre em contato connosco para saber mais sobre este projeto ou para discutir oportunidades semelhantes.
              </p>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: designSystem.spacing[4], justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/contacto')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: designSystem.spacing[2], padding: `${designSystem.spacing[5]} ${designSystem.spacing[10]}`, background: designSystem.colors.neutral.white, color: designSystem.colors.brand.primary, borderRadius: designSystem.borderRadius.full, fontWeight: designSystem.typography.fontWeight.semibold, fontSize: designSystem.typography.fontSize.base, border: 'none', cursor: 'pointer', boxShadow: designSystem.shadows.xl }}
                >
                  <Phone size={20} />
                  Agendar Reunião
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('https://wa.me/351963290394?text=Olá! Tenho interesse no projeto: ' + encodeURIComponent(project.title), '_blank')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: designSystem.spacing[2], padding: `${designSystem.spacing[5]} ${designSystem.spacing[10]}`, background: 'transparent', color: designSystem.colors.neutral.white, borderRadius: designSystem.borderRadius.full, fontWeight: designSystem.typography.fontWeight.semibold, fontSize: designSystem.typography.fontSize.base, border: `2px solid ${designSystem.colors.neutral.white}`, cursor: 'pointer' }}
                >
                  <MessageSquare size={20} />
                  WhatsApp
                </motion.button>
              </div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Projetos Relacionados */}
      <RelatedProjects currentProjectId={project.id} currentStatus={project.status} isMobile={isMobile} />
    </div>
  );
}

function RelatedProjects({ currentProjectId, currentStatus, isMobile }: { currentProjectId: string; currentStatus: string; isMobile: boolean }) {
  const router = useRouter();
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await supabaseFetch('projects');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.projects) {
            const filtered = data.projects
              .filter((p: Project) => p.id !== currentProjectId && (p.status === currentStatus || p.status === 'available'))
              .slice(0, 4);
            setRelatedProjects(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching related projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRelated();
  }, [currentProjectId, currentStatus]);

  if (isLoading || relatedProjects.length === 0) return null;

  return (
    <Section background="muted">
      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <h2 style={{ color: designSystem.colors.neutral[900], marginBottom: designSystem.spacing[8], textAlign: 'center', fontSize: isMobile ? designSystem.typography.fontSize['2xl'] : undefined }}>
            Projetos Relacionados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))', gap: designSystem.spacing[6] }}>
            {relatedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}
                onClick={() => router.push(`/portfolio/${project.id}`)}
                style={{ background: designSystem.colors.neutral.white, borderRadius: designSystem.borderRadius['2xl'], overflow: 'hidden', cursor: 'pointer', boxShadow: designSystem.shadows.md, border: `1px solid ${designSystem.colors.neutral[200]}`, transition: 'all 0.3s ease' }}
              >
                <div style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}>
                  <ImageWithFallback src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: designSystem.spacing[3], right: designSystem.spacing[3] }}>
                    <StatusBadge status={project.status} size="sm" />
                  </div>
                </div>
                <div style={{ padding: designSystem.spacing[6] }}>
                  <h3 style={{ color: designSystem.colors.neutral[900], fontSize: designSystem.typography.fontSize.lg, fontWeight: designSystem.typography.fontWeight.bold, marginBottom: designSystem.spacing[2], lineHeight: designSystem.typography.lineHeight.snug }}>{project.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designSystem.spacing[2], color: designSystem.colors.neutral[600], fontSize: designSystem.typography.fontSize.sm, marginBottom: designSystem.spacing[4] }}>
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: designSystem.spacing[4], borderTop: `1px solid ${designSystem.colors.neutral[200]}` }}>
                    <div>
                      <div style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.neutral[600], marginBottom: designSystem.spacing[1] }}>ROI</div>
                      <div style={{ fontSize: designSystem.typography.fontSize.xl, fontWeight: designSystem.typography.fontWeight.bold, color: designSystem.colors.brand.secondary }}>{project.roi}</div>
                    </div>
                    <motion.div whileHover={{ x: 4 }} style={{ color: designSystem.colors.brand.primary }}>
                      <ArrowRight size={24} />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

function MetricCard({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ padding: designSystem.spacing[4], background: highlight ? `linear-gradient(135deg, ${designSystem.colors.brand.secondary}15, ${designSystem.colors.brand.secondary}05)` : designSystem.colors.neutral.white, border: `1px solid ${highlight ? designSystem.colors.brand.secondary : designSystem.colors.neutral[200]}`, borderRadius: designSystem.borderRadius.lg, textAlign: 'center' }}>
      <div style={{ color: highlight ? designSystem.colors.brand.secondary : designSystem.colors.neutral[600], marginBottom: designSystem.spacing[2], display: 'flex', justifyContent: 'center' }}>{icon}</div>
      <div style={{ fontSize: designSystem.typography.fontSize.xs, color: designSystem.colors.neutral[600], marginBottom: designSystem.spacing[1] }}>{label}</div>
      <div style={{ fontSize: designSystem.typography.fontSize.xl, fontWeight: designSystem.typography.fontWeight.bold, color: highlight ? designSystem.colors.brand.secondary : designSystem.colors.neutral[900] }}>{value}</div>
    </div>
  );
}

function CharacteristicRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="inline-flex items-center justify-between" style={{ paddingBottom: designSystem.spacing[4], borderBottom: `1px solid ${designSystem.colors.neutral[100]}` }}>
      <div className="inline-flex items-center gap-3">
        <div style={{ color: designSystem.colors.neutral[400] }}>{icon}</div>
        <span style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>{label}</span>
      </div>
      <span style={{ fontSize: designSystem.typography.fontSize.sm, fontWeight: designSystem.typography.fontWeight.semibold, color: designSystem.colors.neutral[900] }}>{value}</span>
    </div>
  );
}

function FinancialMetricCard({ label, value, subtitle, breakdown, highlight, success }: { label: string; value: string; subtitle?: string; breakdown?: { label: string; value: string }[]; highlight?: boolean; success?: boolean }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} style={{ padding: designSystem.spacing[6], background: highlight ? `linear-gradient(135deg, ${designSystem.colors.brand.secondary}, ${designSystem.colors.brand.secondary}dd)` : designSystem.colors.neutral.white, borderRadius: designSystem.borderRadius.xl, boxShadow: designSystem.shadows.md, textAlign: 'center' }}>
      <div style={{ fontSize: designSystem.typography.fontSize.sm, color: highlight ? designSystem.colors.neutral.white : designSystem.colors.neutral[600], marginBottom: designSystem.spacing[3] }}>{label}</div>
      <div style={{ fontSize: designSystem.typography.fontSize['3xl'], fontWeight: designSystem.typography.fontWeight.bold, color: highlight ? designSystem.colors.neutral.white : success ? designSystem.colors.brand.secondary : designSystem.colors.neutral[900], marginBottom: subtitle || breakdown ? designSystem.spacing[3] : 0 }}>{value}</div>
      {subtitle && <div style={{ fontSize: designSystem.typography.fontSize.sm, fontWeight: designSystem.typography.fontWeight.semibold, color: highlight ? designSystem.colors.neutral.white : designSystem.colors.brand.secondary }}>{subtitle}</div>}
      {breakdown && (
        <div style={{ marginTop: designSystem.spacing[4], paddingTop: designSystem.spacing[4], borderTop: `1px solid ${designSystem.colors.neutral[100]}`, display: 'flex', flexDirection: 'column', gap: designSystem.spacing[2] }}>
          {breakdown.map((item, index) => (
            <div key={index} className="inline-flex items-center justify-between" style={{ fontSize: designSystem.typography.fontSize.sm, color: designSystem.colors.neutral[600] }}>
              <span>{item.label}</span>
              <span style={{ fontWeight: designSystem.typography.fontWeight.semibold }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
