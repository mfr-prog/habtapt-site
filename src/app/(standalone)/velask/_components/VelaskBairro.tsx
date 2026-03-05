'use client';

import React from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
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
            <div
              className={bairroInView.isInView ? 'anim-fade-in-up' : ''}
              style={{ position: 'relative', minHeight: isMobile ? 300 : 500, borderRadius: '0.75rem', overflow: 'hidden', opacity: bairroInView.isInView ? undefined : 0 }}
            >
              <img
                src="/images/velask/common/campanha.webp"
                alt="Estação de Campanhã, Porto"
                loading="lazy"
                width={1200}
                height={600}
                decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Right — text */}
            <div
              className={bairroInView.isInView ? 'anim-fade-in-up anim-delay-1' : ''}
              style={{ opacity: bairroInView.isInView ? undefined : 0 }}
            >
              <span style={sectionBadge()}>O Bairro</span>

              <h2 style={{ ...sectionTitle, textAlign: 'left' }}>
                Campanhã. Porto a sério.
              </h2>

              <p style={{ ...bodyText, marginBottom: sp[8] }}>
                A três minutos a pé do metro, a cinco do maior shopping da zona, a dez da estação que liga o Porto ao resto do país e ao aeroporto. Mas o que faz Campanhã diferente não são as distâncias — é o facto de ser um bairro real, com vida própria, onde ainda se conhece o dono do café. Uma das últimas zonas do Porto onde ainda é possível comprar bem, viver melhor e chegar a qualquer lado sem carro.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
