/**
 * Project Detail Skeleton - Loading state para página de detalhe do projeto
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { Container } from '../Container';
import { Section } from '../Section';
import { designSystem } from '../design-system';

export function ProjectDetailSkeleton() {
  return (
    <>
      <Section background="white" style={{ paddingTop: '100px', paddingBottom: designSystem.spacing[8] }}>
        <Container>
          {/* Back Button Skeleton */}
          <div
            style={{
              width: '150px',
              height: '40px',
              background: designSystem.colors.neutral[200],
              borderRadius: designSystem.borderRadius.md,
              marginBottom: designSystem.spacing[6],
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Hero Content Skeleton */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: designSystem.spacing[12],
            }}
          >
            {/* Image Skeleton */}
            <div
              style={{
                width: '100%',
                height: '500px',
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.xl,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />

            {/* Info Skeleton */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[4] }}>
              <div
                style={{
                  width: '120px',
                  height: '32px',
                  background: designSystem.colors.neutral[200],
                  borderRadius: designSystem.borderRadius.full,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              <div
                style={{
                  width: '80%',
                  height: '48px',
                  background: designSystem.colors.neutral[200],
                  borderRadius: designSystem.borderRadius.md,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              <div
                style={{
                  width: '60%',
                  height: '24px',
                  background: designSystem.colors.neutral[200],
                  borderRadius: designSystem.borderRadius.md,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '120px',
                  background: designSystem.colors.neutral[200],
                  borderRadius: designSystem.borderRadius.md,
                  marginTop: designSystem.spacing[4],
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* Details Section Skeleton */}
      <Section background="neutral.50" style={{ paddingTop: designSystem.spacing[16], paddingBottom: designSystem.spacing[16] }}>
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: designSystem.spacing[8],
            }}
          >
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[8] }}>
              <CardSkeleton />
              <CardSkeleton />
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[8] }}>
              <CardSkeleton />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

function CardSkeleton() {
  return (
    <div
      style={{
        background: designSystem.colors.neutral.white,
        padding: designSystem.spacing[6],
        borderRadius: designSystem.borderRadius.xl,
        boxShadow: designSystem.shadows.sm,
      }}
    >
      <div
        style={{
          width: '60%',
          height: '28px',
          background: designSystem.colors.neutral[200],
          borderRadius: designSystem.borderRadius.md,
          marginBottom: designSystem.spacing[6],
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[4] }}>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: '100%',
              height: '48px',
              background: designSystem.colors.neutral[200],
              borderRadius: designSystem.borderRadius.md,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
