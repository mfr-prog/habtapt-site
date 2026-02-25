'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { ChevronDown } from '@/components/icons';
import { locationAccordion } from '../_data/velask-data';
import { c, t, sp, sectionBadge, sectionTitle, bodyText } from './velask-styles';

interface VelaskBairroProps {
  isMobile: boolean;
}

export function VelaskBairro({ isMobile }: VelaskBairroProps) {
  const bairroInView = useInView({ threshold: 0.1 });
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleAccordion = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <Section background="white">
      <Container>
        <div ref={bairroInView.ref}>
          <div className="grid gap-8" style={{ gridTemplateColumns: isMobile ? '1fr' : '55% 45%', alignItems: 'start' }}>
            {/* Left — photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={bairroInView.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative', minHeight: isMobile ? 300 : 500, borderRadius: '0.75rem', overflow: 'hidden' }}
            >
              <img
                src="/images/velask/common/9.jpeg"
                alt="Bairro de Campanhã, Porto"
                loading="lazy"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>

            {/* Right — text + accordion */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={bairroInView.isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span style={sectionBadge()}>O Bairro</span>

              <h2 style={{ ...sectionTitle, textAlign: 'left' }}>
                Campanhã. Porto a sério.
              </h2>

              <p style={{ ...bodyText, marginBottom: sp[8] }}>
                Não é o centro histórico para turistas. É onde os portuenses escolhem viver. Campanhã tem metro a 3 minutos a pé, o maior centro comercial da zona a 5 minutos, e a estação de Campanhã — o maior nó intermodal do Porto — a 10 minutos a pé. Daqui chega ao aeroporto em 15 minutos de carro e ao centro do Porto em menos de 20. É um bairro que funciona no dia a dia, não só nos fins de semana.
              </p>

              {/* Accordion */}
              <div style={{ textAlign: 'left' }}>
                {locationAccordion.map((cat, i) => (
                  <div
                    key={i}
                    style={{ borderBottom: `1px solid ${c.neutral[200]}` }}
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
                        transition: 'transform 0.25s',
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
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
