'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import {
  Construction, Key, ChefHat,
  Home, Download, ArrowRight, Eye,
} from '@/components/icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { benefits, interiorFeatures, units, unitImages } from '../_data/velask-data';
import {
  ds, c, t, sp,
  sectionBadge, sectionTitle, bodyText, cardBase, ctaButtonPrimary,
} from './velask-styles';
import { VelaskLightbox } from './VelaskLightbox';

const benefitIcons = { Construction, Key, ChefHat } as const;

/* ── O PROJECTO ── */

interface ProjectProps {
  isMobile: boolean;
}

export function VelaskProjeto({ isMobile }: ProjectProps) {
  const empInView = useInView({ threshold: 0.1 });

  return (
    <Section background="white">
      <Container>
        <div ref={empInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge()}>O Projecto</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
            O Velask
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '48rem', margin: '0 auto', marginBottom: sp[12] }}>
            <p style={bodyText}>
              O Velask é uma moradia histórica em Campanhã, Porto, totalmente reabilitada pela HABTA em 2026. Três apartamentos novos — T1 com jardim e garagem, T2 com jardim e anexo, T3 Duplex — com acabamentos de qualidade e entrega em 60 dias. Cada detalhe foi pensado para quem quer estrear, não renovar.
            </p>
          </motion.div>

          <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', maxWidth: '64rem', margin: '0 auto' }}>
            {benefits.map((b, i) => {
              const Icon = benefitIcons[b.iconName];
              return (
                <motion.div key={i} style={{ ...cardBase, padding: sp[8], display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: sp[3] }} initial={{ opacity: 0, y: 20 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(26,62,92,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 24, height: 24, color: c.brand.secondary }} />
                  </div>
                  <h3 style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.neutral[900], lineHeight: t.lineHeight.snug }}>{b.title}</h3>
                  <p style={{ fontSize: t.fontSize.base, lineHeight: t.lineHeight.relaxed, color: c.neutral[600] }}>{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ── INTERIORES ── */

interface InterioresProps {
  isMobile: boolean;
}

export function VelaskInteriores({ isMobile }: InterioresProps) {
  const intInView = useInView({ threshold: 0.1 });

  return (
    <Section background="muted" id="interiores">
      <Container>
        <div ref={intInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge(true)}>Conceito de Interiores</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
            Interiores onde a luz é protagonista
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '48rem', margin: `0 auto ${sp[12]}` }}>
            Espaços desenhados para captar a luz natural ao longo do dia, com tons claros, madeira de carvalho e linhas contemporâneas. Um conceito de interiores que transforma cada divisão num lugar onde apetece estar.
          </motion.p>

          <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', maxWidth: '64rem', margin: '0 auto' }}>
            {interiorFeatures.map((f, i) => (
              <motion.div key={i} style={{ ...cardBase, padding: sp[8], display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: sp[3], height: '100%' }} initial={{ opacity: 0, y: 20 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}>
                <div style={{ width: 40, height: 40, borderRadius: ds.borderRadius.lg, background: 'rgba(26,62,92,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Home style={{ width: 20, height: 20, color: c.brand.primary }} />
                </div>
                <h3 style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.neutral[900], marginBottom: sp[2], lineHeight: t.lineHeight.snug }}>{f.title}</h3>
                <p style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600] }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={intInView.isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.8 }} style={{ fontSize: t.fontSize.xs, fontStyle: 'italic', color: c.neutral[500], marginTop: sp[10] }}>
            As imagens e renders são meramente ilustrativos. Mobiliário e decoração não incluídos. Soluções finais dependem de projeto de acabamentos.
          </motion.p>
        </div>
      </Container>
    </Section>
  );
}

/* ── PLANTAS E TIPOLOGIAS ── */

interface PlantasProps {
  isMobile: boolean;
  onScrollToForm: () => void;
}

export function VelaskPlantas({ isMobile, onScrollToForm }: PlantasProps) {
  const planInView = useInView({ threshold: 0.05 });

  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxImages, setLightboxImages] = React.useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);

  const openUnitGallery = (unitId: string) => {
    const imgs = unitImages[unitId] || [];
    if (imgs.length) {
      setLightboxImages(imgs);
      setLightboxIndex(0);
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <Section background="white" id="plantas">
        <Container>
          <div ref={planInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge()}>Plantas e Tipologias</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
              Três apartamentos com carácter próprio
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[6]}` }}>
              Escolha o que se encaixa na sua vida.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginBottom: sp[12] }}>
              <motion.button onClick={onScrollToForm} style={{ ...ctaButtonPrimary, background: c.gradients.primary, color: '#fff', boxShadow: ds.shadows.primaryHover }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Download style={{ width: 18, height: 18 }} /> DOWNLOAD PLANTAS (PDF)
              </motion.button>
            </motion.div>

            <Tabs defaultValue="rc" className="flex flex-col gap-2">
              <TabsList className="inline-flex items-center justify-center p-0 gap-3 flex-wrap" style={{ background: 'transparent', height: 'auto', marginBottom: sp[8] }}>
                {units.map((u) => (
                  <TabsTrigger
                    key={u.id}
                    value={u.id}
                    className="data-[state=active]:!bg-[var(--tab-active-bg)] data-[state=active]:!text-white data-[state=active]:!border-[var(--tab-active-bg)] data-[state=active]:shadow-md"
                    style={{
                      // @ts-expect-error CSS custom property
                      '--tab-active-bg': u.color,
                      padding: `${sp[3]} ${sp[7]}`,
                      borderRadius: ds.borderRadius.full,
                      fontSize: t.fontSize.sm,
                      fontWeight: t.fontWeight.semibold,
                      border: `2px solid ${c.neutral[300]}`,
                      background: '#fff',
                      color: c.neutral[700],
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {u.tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {units.map((unit) => (
                <TabsContent key={unit.id} value={unit.id}>
                  <div className="rounded-3xl overflow-hidden" style={{ background: c.neutral[50], border: `1px solid ${c.neutral[200]}` }}>
                    <div className="grid" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                      <div
                        className="relative group cursor-pointer"
                        style={{ minHeight: isMobile ? 200 : 400, overflow: 'hidden' }}
                        onClick={() => openUnitGallery(unit.id)}
                      >
                        <img
                          src={(unitImages[unit.id] || [])[0]?.src}
                          alt={`${unit.title} — render 3D`}
                          loading="lazy"
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: 'rgba(26,62,92,0.35)' }}
                        >
                          <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.9)', color: c.brand.primary, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold }}>
                            <Eye style={{ width: 16, height: 16 }} /> Ver galeria
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center" style={{ padding: isMobile ? sp[8] : sp[12] }}>
                        <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: sp[2] }}>
                          <h3 style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.bold, color: c.neutral[900] }}>{unit.title}</h3>
                          <span style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: `${unit.color}15`, color: unit.color }}>{unit.area}</span>
                        </div>

                        <p style={{ ...bodyText, fontSize: t.fontSize.base, marginBottom: sp[6] }}>{unit.summary}</p>

                        <div className="grid grid-cols-2 gap-2" style={{ marginBottom: sp[8] }}>
                          {unit.specs.map((s, i) => (
                            <div key={i} style={{ padding: `${sp[3]} ${sp[4]}`, borderRadius: '0.75rem', background: '#fff', border: `1px solid ${c.neutral[200]}` }}>
                              <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500], marginBottom: sp[1] }}>{s.label}</p>
                              <p style={{ fontSize: t.fontSize.base, fontWeight: t.fontWeight.bold, color: c.neutral[900] }}>{s.value}</p>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginBottom: sp[8] }}>
                          {unit.copy.map((p, i) => (
                            <p key={i} style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600], marginBottom: i === 0 ? sp[4] : 0 }}>{p}</p>
                          ))}
                        </div>

                        <motion.button onClick={onScrollToForm} style={{ display: 'inline-flex', alignItems: 'center', gap: sp[2], padding: `${sp[3]} ${sp[6]}`, borderRadius: ds.borderRadius.full, background: unit.color, color: '#fff', fontWeight: t.fontWeight.semibold, fontSize: t.fontSize.sm, border: 'none', cursor: 'pointer', boxShadow: `0 4px 14px ${unit.color}40`, width: 'fit-content' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                          {unit.cta} <ArrowRight style={{ width: 16, height: 16 }} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Container>
      </Section>

      <VelaskLightbox
        images={lightboxImages}
        selectedIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </>
  );
}

/** @deprecated Use VelaskProjeto, VelaskInteriores, VelaskPlantas separately */
export function VelaskUnits({ isMobile, onScrollToForm }: { isMobile: boolean; onScrollToForm: () => void }) {
  return (
    <>
      <VelaskProjeto isMobile={isMobile} />
      <VelaskInteriores isMobile={isMobile} />
      <VelaskPlantas isMobile={isMobile} onScrollToForm={onScrollToForm} />
    </>
  );
}
