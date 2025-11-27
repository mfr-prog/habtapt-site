/**
 * Timeline Primitivo - Componente de timeline de projeto
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { motion } from 'motion/react';
import { designSystem } from '../design-system';
import { CheckCircle, Clock } from '../icons';

export interface TimelinePhase {
  phase: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface TimelineProps {
  phases: TimelinePhase[];
  title?: string;
  animated?: boolean;
  className?: string;
}

export function Timeline({ phases, title, animated = true, className = '' }: TimelineProps) {
  const Wrapper = animated ? motion.div : 'div';
  const wrapperProps = animated
    ? {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={className}
      style={{
        background: designSystem.colors.neutral.white,
        padding: designSystem.spacing[5],
        borderRadius: designSystem.borderRadius.xl,
        boxShadow: designSystem.shadows.sm,
      }}
    >
      {title && (
        <h3
          style={{
            color: designSystem.colors.neutral[900],
            marginBottom: designSystem.spacing[5],
          }}
        >
          {title}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[3] }}>
        {phases.map((phase, index) => (
          <TimelineItem key={index} phase={phase} />
        ))}
      </div>
    </Wrapper>
  );
}

function TimelineItem({ phase }: { phase: TimelinePhase }) {
  const statusColors = {
    completed: designSystem.colors.semantic.success,
    'in-progress': designSystem.colors.brand.accent,
    pending: designSystem.colors.neutral[300],
  };

  const bgColor = statusColors[phase.status] || statusColors.pending;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: designSystem.spacing[3],
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          flexShrink: 0,
          background: bgColor,
          color: designSystem.colors.neutral.white,
          transition: designSystem.animations.transition.base,
        }}
      >
        {phase.status === 'completed' ? <CheckCircle size={20} /> : <Clock size={20} />}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: designSystem.typography.fontWeight.semibold,
            color: designSystem.colors.neutral[900],
            marginBottom: '2px',
          }}
        >
          {phase.phase}
        </div>
        <div
          style={{
            fontSize: designSystem.typography.fontSize.sm,
            color: designSystem.colors.neutral[600],
          }}
        >
          {phase.duration}
        </div>
      </div>
    </div>
  );
}
