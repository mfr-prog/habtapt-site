/**
 * Home Hero Skeleton - Loading state para hero section
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { designSystem } from '../design-system';

export function HomeHeroSkeleton() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: designSystem.colors.brand.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: designSystem.spacing[4],
      }}
    >
      <div
        style={{
          maxWidth: '72rem',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Headline Skeleton */}
        <div
          style={{
            marginBottom: designSystem.spacing[8],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: designSystem.spacing[3],
          }}
        >
          <div
            style={{
              height: '60px',
              width: '80%',
              maxWidth: '900px',
              background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1),
              borderRadius: designSystem.borderRadius.lg,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          <div
            style={{
              height: '60px',
              width: '70%',
              maxWidth: '800px',
              background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1),
              borderRadius: designSystem.borderRadius.lg,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.1s',
            }}
          />
        </div>

        {/* Subtitle Skeleton */}
        <div
          style={{
            marginBottom: designSystem.spacing[12],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: designSystem.spacing[2],
          }}
        >
          <div
            style={{
              height: '24px',
              width: '60%',
              maxWidth: '600px',
              background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1),
              borderRadius: designSystem.borderRadius.md,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.2s',
            }}
          />
        </div>

        {/* Buttons Skeleton */}
        <div
          style={{
            display: 'flex',
            gap: designSystem.spacing[4],
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: designSystem.spacing[16],
          }}
        >
          <div
            style={{
              height: '56px',
              width: '200px',
              background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.15),
              borderRadius: designSystem.borderRadius.full,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.3s',
            }}
          />
          <div
            style={{
              height: '56px',
              width: '200px',
              background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.15),
              borderRadius: designSystem.borderRadius.full,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              animationDelay: '0.4s',
            }}
          />
        </div>

        {/* Stats Skeleton */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: designSystem.spacing[8],
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  height: '48px',
                  width: '100px',
                  margin: '0 auto',
                  marginBottom: designSystem.spacing[2],
                  background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.15),
                  borderRadius: designSystem.borderRadius.md,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  animationDelay: `${0.5 + i * 0.1}s`,
                }}
              />
              <div
                style={{
                  height: '16px',
                  width: '140px',
                  margin: '0 auto',
                  background: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.1),
                  borderRadius: designSystem.borderRadius.sm,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  animationDelay: `${0.6 + i * 0.1}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
