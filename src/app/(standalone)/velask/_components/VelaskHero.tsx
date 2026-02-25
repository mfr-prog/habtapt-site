'use client';

import { Container } from '@/components/Container';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import {
  MapPin, Calendar, ChevronDown, ArrowRight,
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
        src="/images/velask/t2/1.jpeg"
        alt=""
        aria-hidden="true"
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
              VELASK
            </motion.h1>

            <motion.p {...anim(1)} style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.semibold, color: c.brand.secondaryLight, marginBottom: sp[6], letterSpacing: t.letterSpacing.wide }}>
              Antas &middot; Porto
            </motion.p>

            <motion.p {...anim(2)} style={{ fontSize: t.fontSize.xl, lineHeight: t.lineHeight.relaxed, color: 'rgba(255,255,255,0.8)', marginBottom: sp[6] }}>
              Reabilitação total 2026. Três apartamentos. Uma moradia transformada.
            </motion.p>

            <motion.div {...anim(3)} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: sp[10] }}>
              <MapPin style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: t.fontSize.sm }}>Rua Manuel Carqueja, 259 — Porto (Campanhã)</span>
            </motion.div>

            <motion.div {...anim(4)} className="flex flex-wrap gap-4 items-center">
              <motion.button onClick={() => scrollToSection('precos')} style={ctaButtonPrimary} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <ArrowRight style={{ width: 20, height: 20 }} /> Ver Apartamentos
              </motion.button>
              <motion.button onClick={() => scrollToSection('contacto')} style={ctaButtonOutline} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Calendar style={{ width: 20, height: 20 }} /> Marcar Visita
              </motion.button>
            </motion.div>
          </div>

          <motion.div {...anim(5)} className="grid grid-cols-3 gap-6" style={{ marginTop: sp[20], maxWidth: '40rem' }}>
            {counters.map((ct, i) => (
              <div key={i}>
                <p style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: t.fontWeight.black, color: '#fff', lineHeight: 1 }}>
                  {ct.value}
                  {ct.suffix && <span style={{ fontSize: t.fontSize['2xl'], color: c.brand.secondaryLight, marginLeft: sp[1] }}>{ct.suffix}</span>}
                </p>
                <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: sp[2], lineHeight: t.lineHeight.snug }}>{ct.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div {...anim(6)} className="grid grid-cols-2 gap-4" style={{ marginTop: sp[12] }}>
            {highlights.map((h, i) => (
              <motion.div key={i} className="flex items-start gap-3 p-4 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(26,62,92,0.35), rgba(15,39,56,0.45))', border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} whileHover={isMobile ? {} : { y: -4, scale: 1.01 }}>
                <span style={{ fontSize: t.fontSize.xl, flexShrink: 0, marginTop: 2 }}>{h.icon}</span>
                <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.85)', lineHeight: t.lineHeight.snug }}>{h.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>

      <motion.div className="absolute" style={{ bottom: sp[8], left: '50%', transform: 'translateX(-50%)' }} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
        <ChevronDown style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)' }} />
      </motion.div>
    </section>
  );
}
