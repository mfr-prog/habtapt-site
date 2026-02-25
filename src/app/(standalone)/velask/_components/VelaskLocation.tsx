'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { MapPin, ExternalLink, ChevronDown } from '@/components/icons';
import { locationAccordion } from '../_data/velask-data';
import { ds, c, t, sp, sectionBadge, sectionTitle, bodyText, ctaButtonPrimary } from './velask-styles';

interface VelaskLocationProps {
  isMobile: boolean;
}

export function VelaskLocation({ isMobile }: VelaskLocationProps) {
  const locInView = useInView({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleAccordion = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

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

          <motion.p initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[8]}` }}>
            Antas coloca-o a minutos de tudo o que importa.
          </motion.p>

          {/* Bug #02 — Google Maps embed with proper search URL */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '56rem', margin: `0 auto ${sp[8]}` }}>
            <div style={{ position: 'relative', width: '100%', height: 420, borderRadius: '1rem', overflow: 'hidden', border: `1px solid ${c.neutral[200]}` }}>
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Rua+Manuel+Carqueja+259,Porto,Portugal&zoom=16"
                style={{ width: '100%', height: '100%', border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localizacao VELASK — Rua Manuel Carqueja 259, Porto"
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginBottom: sp[12] }}>
            <motion.a href="https://www.google.com/maps/search/Rua+Manuel+Carqueja+259+Porto" target="_blank" rel="noopener noreferrer" style={{ ...ctaButtonPrimary, background: c.gradients.primary, boxShadow: ds.shadows.primaryHover, textDecoration: 'none' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}>
              <MapPin style={{ width: 18, height: 18 }} /> VER NO MAPA <ExternalLink style={{ width: 14, height: 14 }} />
            </motion.a>
          </motion.div>

          {/* Bug #08 — Accordion with 4 categories */}
          <div style={{ maxWidth: '42rem', margin: '0 auto', textAlign: 'left' }}>
            {locationAccordion.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={locInView.isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                style={{
                  borderBottom: `1px solid ${c.neutral[200]}`,
                }}
              >
                <button
                  onClick={() => toggleAccordion(i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${sp[5]} 0`,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: sp[3] }}>
                    <span style={{ fontSize: t.fontSize.xl }}>{cat.icon}</span>
                    <span style={{ fontSize: t.fontSize.base, fontWeight: t.fontWeight.semibold, color: c.neutral[900] }}>{cat.title}</span>
                  </span>
                  <ChevronDown style={{
                    width: 20,
                    height: 20,
                    color: c.neutral[500],
                    transition: 'transform 0.2s',
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }} />
                </button>
                {openIndex === i && (
                  <div style={{ paddingBottom: sp[5], paddingLeft: sp[10] }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: sp[2] }}>
                      {cat.items.map((item, j) => (
                        <li key={j} style={{ fontSize: t.fontSize.sm, color: c.neutral[600], lineHeight: t.lineHeight.relaxed }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
