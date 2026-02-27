import React from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { designSystem } from './design-system';
import { Home, TrendingUp, ArrowRight } from './icons';
import Link from 'next/link';

export function DualCTA() {
  return (
    <Section background="white">
      <Container>
        <div
          className="text-center"
          style={{ marginBottom: designSystem.spacing[12] }}
        >
          <h2
            style={{
              fontSize: designSystem.typography.fontSize['3xl'],
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[4],
              letterSpacing: designSystem.typography.letterSpacing.tight,
            }}
          >
            Como quer encontrar o seu próximo imóvel?
          </h2>
          <p
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
              maxWidth: '32rem',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Explore os nossos imóveis no modo que faz mais sentido para si.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: designSystem.spacing[6],
            maxWidth: '56rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {/* Quero Morar */}
          <Link href="/imoveis?modo=morar" style={{ textDecoration: 'none' }}>
            <div
              className="hover-lift"
              style={{
                background: designSystem.colors.gradients.primary,
                borderRadius: designSystem.borderRadius['2xl'],
                padding: designSystem.spacing[8],
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-10%',
                  width: '50%',
                  height: '160%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  className="inline-flex items-center justify-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: designSystem.borderRadius.xl,
                    background: 'rgba(255, 255, 255, 0.15)',
                    marginBottom: designSystem.spacing[6],
                  }}
                >
                  <Home size={28} style={{ color: designSystem.colors.neutral.white }} />
                </div>
                <h3
                  style={{
                    fontSize: designSystem.typography.fontSize['2xl'],
                    fontWeight: designSystem.typography.fontWeight.bold,
                    color: designSystem.colors.neutral.white,
                    marginBottom: designSystem.spacing[3],
                  }}
                >
                  Quero Morar
                </h3>
                <p
                  style={{
                    fontSize: designSystem.typography.fontSize.base,
                    color: 'rgba(255, 255, 255, 0.85)',
                    lineHeight: designSystem.typography.lineHeight.relaxed,
                    marginBottom: designSystem.spacing[6],
                  }}
                >
                  Encontre a sua próxima casa com acabamentos premium e localização privilegiada.
                </p>
                <div
                  className="inline-flex items-center"
                  style={{
                    gap: designSystem.spacing[2],
                    fontSize: designSystem.typography.fontSize.base,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.neutral.white,
                  }}
                >
                  Ver imóveis para morar
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Link>

          {/* Quero Investir */}
          <Link href="/imoveis?modo=investir" style={{ textDecoration: 'none' }}>
            <div
              className="hover-lift"
              style={{
                background: designSystem.colors.gradients.secondary,
                borderRadius: designSystem.borderRadius['2xl'],
                padding: designSystem.spacing[8],
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-30%',
                  right: '-10%',
                  width: '50%',
                  height: '160%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  className="inline-flex items-center justify-center"
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: designSystem.borderRadius.xl,
                    background: 'rgba(26, 62, 92, 0.15)',
                    marginBottom: designSystem.spacing[6],
                  }}
                >
                  <TrendingUp size={28} style={{ color: designSystem.colors.brand.primary }} />
                </div>
                <h3
                  style={{
                    fontSize: designSystem.typography.fontSize['2xl'],
                    fontWeight: designSystem.typography.fontWeight.bold,
                    color: designSystem.colors.brand.primary,
                    marginBottom: designSystem.spacing[3],
                  }}
                >
                  Quero Investir
                </h3>
                <p
                  style={{
                    fontSize: designSystem.typography.fontSize.base,
                    color: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.8),
                    lineHeight: designSystem.typography.lineHeight.relaxed,
                    marginBottom: designSystem.spacing[6],
                  }}
                >
                  Oportunidades imobiliárias com análise financeira detalhada e acompanhamento personalizado.
                </p>
                <div
                  className="inline-flex items-center"
                  style={{
                    gap: designSystem.spacing[2],
                    fontSize: designSystem.typography.fontSize.base,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.brand.primary,
                  }}
                >
                  Ver oportunidades de investimento
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
