'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { MapPin, ExternalLink } from '@/components/icons';
import { locationCards } from '../_data/velask-data';
import { ds, c, t, sp, sectionBadge, sectionTitle, cardBase, ctaButtonPrimary } from './velask-styles';

interface VelaskLocationProps {
  isMobile: boolean;
}

export function VelaskLocation({ isMobile }: VelaskLocationProps) {
  const locInView = useInView({ threshold: 0.1 });

  return (
    <Section background="white">
      <Container>
        <div ref={locInView.ref} className="text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <span style={sectionBadge()}>Localizacao</span>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
            Tudo ao seu alcance
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} style={{ fontSize: t.fontSize.base, color: c.neutral[600], marginBottom: sp[4] }}>
            Rua Manuel Carqueja, 259 — Porto (Campanha)
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ marginBottom: sp[12] }}>
            <motion.a href="https://www.google.com/maps/search/Rua+Manuel+Carqueja+259+Porto" target="_blank" rel="noopener noreferrer" style={{ ...ctaButtonPrimary, background: c.gradients.primary, boxShadow: ds.shadows.primaryHover, textDecoration: 'none' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}>
              <MapPin style={{ width: 18, height: 18 }} /> VER NO MAPA <ExternalLink style={{ width: 14, height: 14 }} />
            </motion.a>
          </motion.div>

          <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}>
            {locationCards.map((card, i) => (
              <motion.div key={i} style={{ ...cardBase, padding: sp[8], textAlign: 'left' }} initial={{ opacity: 0, y: 20 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}>
                <div style={{ width: 40, height: 40, borderRadius: ds.borderRadius.full, background: c.gradients.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.bold, marginBottom: sp[4] }}>
                  {card.num}
                </div>
                <h3 style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.neutral[900], marginBottom: sp[2], lineHeight: t.lineHeight.snug }}>{card.title}</h3>
                <p style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600] }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
