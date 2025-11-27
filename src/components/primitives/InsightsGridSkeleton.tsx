/**
 * Insights Grid Skeleton - Skeleton state otimizado
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { designSystem } from '../design-system';

interface InsightsGridSkeletonProps {
  count?: number;
}

export function InsightsGridSkeleton({ count = 3 }: InsightsGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      style={{ gap: designSystem.spacing[6] }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <InsightCardSkeleton key={index} delay={index * 0.05} />
      ))}
    </div>
  );
}

interface InsightCardSkeletonProps {
  delay?: number;
}

function InsightCardSkeleton({ delay = 0 }: InsightCardSkeletonProps) {
  return (
    <div
      className="bg-white overflow-hidden"
      style={{
        borderRadius: designSystem.borderRadius['2xl'],
        border: `1px solid ${designSystem.colors.neutral[200]}`,
        padding: designSystem.spacing[6],
        boxShadow: designSystem.shadows.sm,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        animationDelay: `${delay}s`,
      }}
    >
      {/* Icon Skeleton */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: designSystem.borderRadius.xl,
          background: designSystem.colors.neutral[200],
          marginBottom: designSystem.spacing[4],
        }}
      />

      {/* Category + Read Time */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: designSystem.spacing[3],
          marginBottom: designSystem.spacing[3],
        }}
      >
        <div
          style={{
            height: '24px',
            width: '100px',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.full,
          }}
        />
        <div
          style={{
            height: '16px',
            width: '60px',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
          }}
        />
      </div>

      {/* Title */}
      <div style={{ marginBottom: designSystem.spacing[3] }}>
        <div
          style={{
            height: '24px',
            width: '100%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            marginBottom: designSystem.spacing[2],
          }}
        />
        <div
          style={{
            height: '24px',
            width: '80%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: designSystem.spacing[5] }}>
        <div
          style={{
            height: '16px',
            width: '100%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            marginBottom: designSystem.spacing[2],
          }}
        />
        <div
          style={{
            height: '16px',
            width: '90%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
          }}
        />
      </div>

      {/* Button */}
      <div
        style={{
          height: '40px',
          width: '140px',
          background: designSystem.colors.neutral[200],
          borderRadius: designSystem.borderRadius.lg,
        }}
      />
    </div>
  );
}
