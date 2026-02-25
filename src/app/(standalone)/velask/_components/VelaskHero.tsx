'use client';

import { Container } from '@/components/Container';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import {
  MapPin, MessageCircle, Download, Calendar, Star, ChevronDown,
} from '@/components/icons';
import { counters, highlights } from '../_data/velask-data';
import { c, t, sp, sectionBadge, ctaButtonPrimary, ctaButtonOutline, anim } from './velask-styles';

interface VelaskHeroProps {
  isMobile: boolean;
  onScrollToForm: () => void;
}

export function VelaskHero({ isMobile, onScrollToForm }: VelaskHeroProps) {
  const heroInView = useInView({ threshold: 0.1 });

  const handleWhatsApp = () => {
    window.open('https://wa.me/351963290394?text=Ola! Gostaria de saber mais sobre o VELASK Residence.', '_blank');
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
      {/* Background image */}
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
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(10,20,35,0.88) 0%, rgba(15,28,46,0.82) 50%, rgba(10,20,35,0.75) 100%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(184,149,106,0.12) 0%, transparent 70%)' }} />

      <Container>
        <div style={{ position: 'relative', zIndex: 10, paddingTop: sp[32], paddingBottom: sp[32] }}>
          <div style={{ maxWidth: '48rem' }}>
            <motion.div {...anim(0)}>
              <span style={{ ...sectionBadge(true), color: c.brand.secondaryLight, background: 'rgba(184,149,106,0.15)', border: '1px solid rgba(184,149,106,0.25)' }}>
                <Star style={{ width: 16, height: 16 }} />
                Novo Empreendimento
              </span>
            </motion.div>

            <motion.h1 {...anim(1)} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: t.fontWeight.black, letterSpacing: t.letterSpacing.tight, lineHeight: t.lineHeight.tight, color: '#fff', marginBottom: sp[6] }}>
              T1, T2 e T3 Duplex<br />
              <span style={{ color: c.brand.secondaryLight }}>nas Antas (Campanha), Porto</span>
            </motion.h1>

            <motion.p {...anim(2)} style={{ fontSize: t.fontSize.xl, lineHeight: t.lineHeight.relaxed, color: 'rgba(255,255,255,0.8)', marginBottom: sp[6] }}>
              Tres apartamentos a estrear, com jardins privados e um duplex com sotao — numa rua residencial com acessos e transportes por perto.
            </motion.p>

            <motion.div {...anim(3)} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: sp[8] }}>
              <MapPin style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ fontSize: t.fontSize.sm }}>Rua Manuel Carqueja, 259 — Porto (Campanha)</span>
            </motion.div>

            <motion.div {...anim(4)} style={{ marginBottom: sp[10] }}>
              <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, letterSpacing: t.letterSpacing.widest, textTransform: 'uppercase', color: c.brand.secondaryLight, marginBottom: sp[1] }}>
                Tabela de Precos Sob Consulta
              </p>
              <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.5)' }}>
                Receba a brochura com plantas, areas e valores.
              </p>
            </motion.div>

            <motion.div {...anim(5)} className="flex flex-wrap gap-4 items-center">
              <motion.button onClick={onScrollToForm} style={ctaButtonPrimary} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Calendar style={{ width: 20, height: 20 }} /> AGENDAR VISITA
              </motion.button>
              <motion.button onClick={onScrollToForm} style={ctaButtonOutline} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Download style={{ width: 20, height: 20 }} /> DOWNLOAD PLANTAS (PDF)
              </motion.button>
              <motion.button onClick={handleWhatsApp} style={{ display: 'inline-flex', alignItems: 'center', gap: sp[2], padding: sp[3], fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }} whileHover={{ color: '#fff' }}>
                <MessageCircle style={{ width: 16, height: 16 }} /> Falar por WhatsApp
              </motion.button>
            </motion.div>
          </div>

          <motion.div {...anim(6)} className="grid grid-cols-3 gap-6" style={{ marginTop: sp[20], maxWidth: '40rem' }}>
            {counters.map((ct, i) => (
              <div key={i}>
                <p style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: t.fontWeight.black, color: '#fff', lineHeight: 1 }}>
                  {ct.value}
                  <span style={{ fontSize: t.fontSize['2xl'], color: c.brand.secondaryLight, marginLeft: sp[1] }}>{ct.suffix}</span>
                </p>
                <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: sp[2], lineHeight: t.lineHeight.snug }}>{ct.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div {...anim(7)} className="grid grid-cols-2 gap-4" style={{ marginTop: sp[12] }}>
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
