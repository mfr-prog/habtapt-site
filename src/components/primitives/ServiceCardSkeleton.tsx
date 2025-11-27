/**
 * Service Card Skeleton - Loading state para cards de serviços
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { designSystem } from '../design-system';

interface ServiceCardSkeletonProps {
  count?: number;
}

export function ServiceCardSkeleton({ count = 3 }: ServiceCardSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3"
      style={{ gap: designSystem.spacing[6] }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardItemSkeleton key={index} delay={index * 0.1} />
      ))}
    </div>
  );
}

interface ServiceCardItemSkeletonProps {
  delay?: number;
}

function ServiceCardItemSkeleton({ delay = 0 }: ServiceCardItemSkeletonProps) {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: designSystem.borderRadius['2xl'],
        padding: designSystem.spacing[8],
        border: `1px solid ${designSystem.colors.neutral[200]}`,
        boxShadow: designSystem.shadows.md,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: `${delay}s`,
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: designSystem.borderRadius.xl,
          background: designSystem.colors.neutral[200],
          marginBottom: designSystem.spacing[5],
        }}
      />

      {/* Title */}
      <div
        style={{
          height: '32px',
          width: '80%',
          background: designSystem.colors.neutral[200],
          borderRadius: designSystem.borderRadius.md,
          marginBottom: designSystem.spacing[4],
        }}
      />

      {/* Description */}
      <div style={{ marginBottom: designSystem.spacing[6] }}>
        <div
          style={{
            height: '16px',
            width: '100%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.sm,
            marginBottom: designSystem.spacing[2],
          }}
        />
        <div
          style={{
            height: '16px',
            width: '90%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.sm,
            marginBottom: designSystem.spacing[2],
          }}
        />
        <div
          style={{
            height: '16px',
            width: '70%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.sm,
          }}
        />
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[3] }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: designSystem.spacing[2],
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: designSystem.borderRadius.full,
                background: designSystem.colors.neutral[200],
                flexShrink: 0,
              }}
            />
            <div
              style={{
                height: '14px',
                width: `${70 + Math.random() * 20}%`,
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.sm,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
