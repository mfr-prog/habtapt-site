// HABTA Skeleton Component - Migrated from /primitives/ to /ui/
// Enhanced with Motion animations and design-system tokens
import React from 'react';
import { motion } from 'motion/react';
import { designSystem } from '../design-system';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: keyof typeof designSystem.borderRadius;
  variant?: 'text' | 'circular' | 'rectangular';
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'base',
  variant = 'rectangular',
  className,
}: SkeletonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'text':
        return {
          width,
          height: '1rem',
          borderRadius: designSystem.borderRadius.base,
        };
      case 'circular':
        return {
          width,
          height: width,
          borderRadius: designSystem.borderRadius.full,
        };
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius: designSystem.borderRadius[borderRadius],
        };
    }
  };

  const skeletonStyle: React.CSSProperties = {
    ...getVariantStyle(),
    background: designSystem.colors.neutral[200],
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <div style={skeletonStyle} className={className}>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(90deg, 
            transparent 0%, 
            ${designSystem.colors.neutral[100]} 50%, 
            transparent 100%
          )`,
          transformOrigin: '0 0',
        }}
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Skeleton presets para componentes comuns
export function SkeletonCard() {
  return (
    <div
      style={{
        padding: designSystem.spacing[8],
        background: designSystem.colors.neutral.white,
        borderRadius: designSystem.borderRadius['2xl'],
        border: `1px solid ${designSystem.colors.neutral[200]}`,
      }}
    >
      <Skeleton width="60%" height="2rem" borderRadius="md" />
      <div style={{ marginTop: designSystem.spacing[4] }}>
        <Skeleton width="100%" height="1rem" borderRadius="base" />
        <div style={{ marginTop: designSystem.spacing[2] }}>
          <Skeleton width="90%" height="1rem" borderRadius="base" />
        </div>
        <div style={{ marginTop: designSystem.spacing[2] }}>
          <Skeleton width="95%" height="1rem" borderRadius="base" />
        </div>
      </div>
      <div style={{ marginTop: designSystem.spacing[6] }}>
        <Skeleton width="40%" height="2.5rem" borderRadius="lg" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ width: '100%' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ marginBottom: designSystem.spacing[2] }}>
          <Skeleton
            width={i === lines - 1 ? '80%' : '100%'}
            height="1rem"
            borderRadius="base"
          />
        </div>
      ))}
    </div>
  );
}
