/**
 * Portfolio Grid Skeleton - Skeleton state otimizado
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { designSystem } from '../design-system';

interface PortfolioGridSkeletonProps {
  count?: number;
  isMobile?: boolean;
}

export function PortfolioGridSkeleton({ count = 6, isMobile = false }: PortfolioGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      style={{ gap: designSystem.spacing[6] }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PortfolioCardSkeleton key={index} isMobile={isMobile} delay={index * 0.05} />
      ))}
    </div>
  );
}

interface PortfolioCardSkeletonProps {
  isMobile?: boolean;
  delay?: number;
}

function PortfolioCardSkeleton({ isMobile = false, delay = 0 }: PortfolioCardSkeletonProps) {
  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: designSystem.borderRadius['3xl'],
        border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
        boxShadow: designSystem.shadows.md,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: `${delay}s`,
      }}
    >
      {/* Image Skeleton */}
      <div
        style={{
          height: designSystem.spacing[64],
          background: `linear-gradient(90deg, ${designSystem.colors.neutral[200]} 0%, ${designSystem.colors.neutral[100]} 50%, ${designSystem.colors.neutral[200]} 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />

      {/* Content Skeleton */}
      <div style={{ padding: designSystem.spacing[6] }}>
        {/* Title */}
        <div
          style={{
            height: '24px',
            width: '80%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            marginBottom: designSystem.spacing[3],
          }}
        />

        {/* Location */}
        <div
          style={{
            height: '16px',
            width: '50%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            marginBottom: designSystem.spacing[4],
          }}
        />

        {/* Strategy Badge */}
        <div
          style={{
            height: '32px',
            width: '40%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.full,
            marginBottom: designSystem.spacing[4],
          }}
        />

        {/* Features Grid */}
        <div
          className="grid grid-cols-3"
          style={{
            gap: designSystem.spacing[3],
            paddingBottom: designSystem.spacing[5],
            marginBottom: designSystem.spacing[5],
            borderBottom: `1px solid ${designSystem.colors.neutral[100]}`,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '16px',
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.md,
              }}
            />
          ))}
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: '28px',
                width: '70%',
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.md,
              }}
            />
          </div>
          <div
            style={{
              height: '40px',
              width: '40px',
              background: designSystem.colors.neutral[200],
              borderRadius: designSystem.borderRadius.full,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}
