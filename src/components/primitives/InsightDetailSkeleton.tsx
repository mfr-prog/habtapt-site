/**
 * Insight Detail Skeleton - Loading state para página de detalhes
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { designSystem } from '../design-system';

export function InsightDetailSkeleton() {
  return (
    <div
      style={{
        maxWidth: '48rem',
        margin: '0 auto',
        padding: designSystem.spacing[4],
      }}
    >
      {/* Back Button Skeleton */}
      <div
        style={{
          height: '40px',
          width: '100px',
          background: designSystem.colors.neutral[200],
          borderRadius: designSystem.borderRadius.lg,
          marginBottom: designSystem.spacing[8],
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />

      {/* Category Badge Skeleton */}
      <div
        style={{
          height: '32px',
          width: '120px',
          background: designSystem.colors.neutral[200],
          borderRadius: designSystem.borderRadius.full,
          marginBottom: designSystem.spacing[4],
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '0.1s',
        }}
      />

      {/* Title Skeleton */}
      <div style={{ marginBottom: designSystem.spacing[4] }}>
        <div
          style={{
            height: '48px',
            width: '100%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            marginBottom: designSystem.spacing[3],
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.2s',
          }}
        />
        <div
          style={{
            height: '48px',
            width: '80%',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.3s',
          }}
        />
      </div>

      {/* Meta Info Skeleton */}
      <div
        style={{
          display: 'flex',
          gap: designSystem.spacing[4],
          marginBottom: designSystem.spacing[8],
        }}
      >
        <div
          style={{
            height: '20px',
            width: '100px',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.sm,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.4s',
          }}
        />
        <div
          style={{
            height: '20px',
            width: '80px',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.sm,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.5s',
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[4] }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i}>
            <div
              style={{
                height: '16px',
                width: '100%',
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.sm,
                marginBottom: designSystem.spacing[2],
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: `${0.6 + i * 0.05}s`,
              }}
            />
            <div
              style={{
                height: '16px',
                width: '95%',
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.sm,
                marginBottom: designSystem.spacing[2],
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: `${0.65 + i * 0.05}s`,
              }}
            />
            <div
              style={{
                height: '16px',
                width: `${70 + Math.random() * 25}%`,
                background: designSystem.colors.neutral[200],
                borderRadius: designSystem.borderRadius.sm,
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                animationDelay: `${0.7 + i * 0.05}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* CTA Section Skeleton */}
      <div
        style={{
          marginTop: designSystem.spacing[12],
          padding: designSystem.spacing[8],
          background: designSystem.colors.neutral[100],
          borderRadius: designSystem.borderRadius['2xl'],
        }}
      >
        <div
          style={{
            height: '32px',
            width: '60%',
            margin: '0 auto',
            marginBottom: designSystem.spacing[4],
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.md,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          }}
        />
        <div
          style={{
            height: '56px',
            width: '200px',
            margin: '0 auto',
            background: designSystem.colors.neutral[200],
            borderRadius: designSystem.borderRadius.full,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            animationDelay: '0.1s',
          }}
        />
      </div>
    </div>
  );
}
