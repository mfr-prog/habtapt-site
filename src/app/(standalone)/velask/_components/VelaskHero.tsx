'use client';

import { Container } from '@/components/Container';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import {
  MapPin, ChevronDown,
  TreePine, Sun, Car, Layers,
} from '@/components/icons';
import { counters, highlights } from '../_data/velask-data';
import { c, t, sp, ctaButtonPrimary, ctaButtonOutline, anim } from './velask-styles';

interface VelaskHeroProps {
  isMobile: boolean;
  onScrollToForm: () => void;
}

export function VelaskHero({ isMobile, onScrollToForm }: VelaskHeroProps) {
  const heroInView = useInView({ threshold: 0.1 });

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroInView.ref}
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src="/images/velask/t2/1.webp"
        alt=""
        aria-hidden="true"
        width={1600}
        height={893}
        fetchPriority="high"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 40%',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(10,20,35,0.88) 0%, rgba(15,28,46,0.82) 50%, rgba(10,20,35,0.75) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(184,149,106,0.12) 0%, transparent 70%)' }} />

      <Container>
        <div style={{ position: 'relative', zIndex: 10, paddingTop: sp[32], paddingBottom: sp[32] }}>
          <div style={{ maxWidth: '48rem' }}>
            <motion.h1 {...anim(0)} style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: t.fontWeight.black, letterSpacing: t.letterSpacing.tight, lineHeight: 1, color: '#fff', marginBottom: sp[4] }}>
              <span style={{ color: c.brand.secondaryLight }}>VELASK</span> Residence
            </motion.h1>

            <motion.p {...anim(1)} style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.semibold, color: c.brand.secondaryLight, marginBottom: sp[6], letterSpacing: t.letterSpacing.wide }}>
              Campanhã &middot; Porto
            </motion.p>

            <motion.p {...anim(2)} style={{ fontSize: t.fontSize.xl, lineHeight: t.lineHeight.relaxed, color: 'rgba(255,255,255,0.8)', marginBottom: sp[6], letterSpacing: t.letterSpacing.wider, textTransform: 'uppercase' }}>
              A estreiar em Abril de 2026
            </motion.p>

            <motion.div {...anim(3)} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: sp[10] }}>
              <MapPin style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: t.fontSize.sm }}>Rua Manuel Carqueja, 259 — Porto (Campanhã)</span>
            </motion.div>

            <motion.div {...anim(4)} className="flex flex-wrap gap-4 items-center">
              <motion.a href="https://wa.me/351963290394?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20Velask%20Residence." target="_blank" rel="noopener noreferrer" style={{ ...ctaButtonPrimary, padding: `${sp[4]} ${sp[8]}`, flexDirection: 'column' as const, gap: sp[1], textDecoration: 'none' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.medium, opacity: 0.8 }}>DESDE</span>
                <span style={{ fontSize: t.fontSize.xl, fontWeight: t.fontWeight.black, letterSpacing: t.letterSpacing.tight }}>399.000 &euro;</span>
              </motion.a>
              <motion.a href="tel:+351963290394" style={{ ...ctaButtonOutline, padding: `${sp[4]} ${sp[8]}`, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', flexDirection: 'column' as const, gap: sp[1] }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.medium, opacity: 0.7, letterSpacing: t.letterSpacing.wider }}>RESERVE JÁ</span>
                <span style={{ fontSize: t.fontSize.base, fontWeight: t.fontWeight.bold }}>+351 963 290 394</span>
              </motion.a>
            </motion.div>
          </div>

          <motion.div {...anim(5)} className="grid grid-cols-3" style={{ marginTop: sp[20], maxWidth: '40rem', gap: sp[8] }}>
            {counters.map((ct, i) => {
              const isLong = ct.value.length > 3;
              return (
                <div key={i} style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.15)' : 'none', paddingLeft: i > 0 ? sp[8] : 0 }}>
                  <p style={{ fontSize: isLong ? 'clamp(1.4rem, 3vw, 2.2rem)' : 'clamp(1.8rem, 4vw, 3rem)', fontWeight: t.fontWeight.black, color: '#fff', lineHeight: 1 }}>
                    {ct.value}
                    {ct.suffix && <span style={{ fontSize: isLong ? t.fontSize.lg : t.fontSize['2xl'], color: c.brand.secondaryLight, marginLeft: sp[1] }}>{ct.suffix}</span>}
                  </p>
                  {ct.label && <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: sp[2], lineHeight: t.lineHeight.snug }}>{ct.label}</p>}
                </div>
              );
            })}
          </motion.div>

          <motion.div {...anim(6)} className="grid grid-cols-2 gap-4" style={{ marginTop: sp[12] }}>
            {highlights.map((h, i) => {
              const icons = { TreePine, Sun, Car, Layers } as Record<string, React.ComponentType<{ style?: React.CSSProperties }>>;
              const Icon = icons[h.iconName];
              return (
                <motion.div key={i} className="flex items-center gap-3" style={{ padding: `${sp[4]} ${sp[5]}`, borderRadius: '1.5rem', background: 'linear-gradient(135deg, rgba(26,62,92,0.35), rgba(15,39,56,0.45))', border: '1px solid rgba(255,255,255,0.12)' }} whileHover={isMobile ? {} : { y: -4, scale: 1.01 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(184,149,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon style={{ width: 18, height: 18, color: c.brand.secondaryLight }} />
                  </div>
                  <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.85)', lineHeight: t.lineHeight.snug }}>{h.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>

      <motion.div className="absolute" style={{ bottom: sp[8], left: '50%', transform: 'translateX(-50%)' }} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <ChevronDown style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)' }} />
      </motion.div>
    </section>
  );
}
