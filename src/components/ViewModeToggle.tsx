'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Home, TrendingUp } from './icons';
import { designSystem } from './design-system';
import type { ViewMode } from '@/utils/hooks/useViewMode';

interface ViewModeToggleProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const options: { value: ViewMode; label: string; icon: typeof Home }[] = [
  { value: 'morar', label: 'Morar', icon: Home },
  { value: 'investir', label: 'Investir', icon: TrendingUp },
];

export function ViewModeToggle({ mode, onModeChange }: ViewModeToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Modo de visualização"
      className="inline-flex items-center relative"
      style={{
        background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.06),
        borderRadius: designSystem.borderRadius.full,
        padding: '4px',
        border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12)}`,
      }}
    >
      {options.map((option) => {
        const isActive = mode === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            aria-pressed={isActive}
            onClick={() => onModeChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                onModeChange(mode === 'morar' ? 'investir' : 'morar');
              }
            }}
            className="relative flex items-center justify-center transition-colors duration-200"
            style={{
              gap: designSystem.spacing[2],
              paddingLeft: designSystem.spacing[6],
              paddingRight: designSystem.spacing[6],
              paddingTop: designSystem.spacing[3],
              paddingBottom: designSystem.spacing[3],
              borderRadius: designSystem.borderRadius.full,
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              zIndex: 1,
              fontSize: designSystem.typography.fontSize['15'],
              fontWeight: isActive
                ? designSystem.typography.fontWeight.bold
                : designSystem.typography.fontWeight.medium,
              color: isActive
                ? designSystem.colors.brand.primary
                : designSystem.colors.neutral[600],
              minWidth: '120px',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="viewmode-indicator"
                className="absolute inset-0"
                style={{
                  background: designSystem.colors.gradients.secondary,
                  borderRadius: designSystem.borderRadius.full,
                  boxShadow: designSystem.shadows.secondaryHover,
                }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center" style={{ gap: designSystem.spacing[2], zIndex: 2 }}>
              <Icon size={18} />
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
