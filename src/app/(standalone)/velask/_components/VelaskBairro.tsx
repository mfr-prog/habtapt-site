'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import { sp, sectionBadge, sectionTitle, bodyText } from './velask-styles';

interface VelaskBairroProps {
  isMobile: boolean;
}

export function VelaskBairro({ isMobile }: VelaskBairroProps) {
  const bairroInView = useInView({ threshold: 0.1 });

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

            {/* Right — text */}
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
                A três minutos a pé do metro, a cinco do maior shopping da zona, a dez da estação que liga o Porto ao resto do país e ao aeroporto. Mas o que faz Campanhã diferente não são as distâncias — é o facto de ser um bairro real, com vida própria, onde ainda se conhece o dono do café. Uma das últimas zonas do Porto onde ainda é possível comprar bem, viver melhor e chegar a qualquer lado sem carro.
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
