// Primitive: Loading Skeleton Component
import React from 'react';
import { motion } from 'motion/react';
import { colors, radius } from '../../utils/styles';
import { animations } from '../../utils/animations';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = radius.md,
  className,
}: SkeletonProps) {
  return (
    <motion.div
      variants={animations.skeleton}
      animate="animate"
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: `linear-gradient(90deg, ${colors.gray[200]} 25%, ${colors.gray[100]} 50%, ${colors.gray[200]} 75%)`,
        backgroundSize: '200% 100%',
      }}
    />
  );
}

// Skeleton presets
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="16px"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      style={{
        background: colors.white,
        borderRadius: radius['2xl'],
        padding: '24px',
        border: `1px solid ${colors.gray[200]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <Skeleton width="60px" height="60px" borderRadius={radius.lg} />
        <div style={{ flex: 1 }}>
          <Skeleton height="20px" width="40%" />
          <div style={{ marginTop: '8px' }}>
            <Skeleton height="16px" width="60%" />
          </div>
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height="40px" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} height="56px" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: colors.white,
              borderRadius: radius['2xl'],
              padding: '24px',
              border: `1px solid ${colors.gray[200]}`,
            }}
          >
            <Skeleton height="24px" width="60%" />
            <div style={{ marginTop: '16px' }}>
              <Skeleton height="40px" width="40%" />
            </div>
            <div style={{ marginTop: '12px' }}>
              <Skeleton height="16px" width="80%" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
