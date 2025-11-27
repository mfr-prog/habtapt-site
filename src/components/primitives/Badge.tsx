/**
 * Badge Primitivo - Sistema centralizado de badges
 * Seguindo Guardião Universal de Front-End
 */

import React from 'react';
import { designSystem } from '../design-system';

export type BadgeVariant = 'status' | 'strategy' | 'roi' | 'custom';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label: string;
  color?: string;
  background?: string;
  border?: string;
  icon?: React.ReactNode;
  className?: string;
}

const sizeConfig = {
  sm: {
    paddingX: designSystem.spacing[2],
    paddingY: designSystem.spacing[1],
    fontSize: '0.75rem',
    iconSize: 14,
  },
  md: {
    paddingX: designSystem.spacing[3],
    paddingY: designSystem.spacing[2],
    fontSize: '0.8125rem',
    iconSize: 16,
  },
  lg: {
    paddingX: designSystem.spacing[5],
    paddingY: designSystem.spacing[3],
    fontSize: '0.9375rem',
    iconSize: 20,
  },
};

export function Badge({
  variant = 'custom',
  size = 'md',
  label,
  color,
  background,
  border,
  icon,
  className = '',
}: BadgeProps) {
  const config = sizeConfig[size];

  return (
    <div
      className={`inline-flex items-center rounded-full backdrop-blur-md ${className}`}
      style={{
        paddingLeft: config.paddingX,
        paddingRight: config.paddingX,
        paddingTop: config.paddingY,
        paddingBottom: config.paddingY,
        gap: icon ? designSystem.spacing[1.5] : 0,
        background: background || designSystem.colors.brand.primary,
        border: `2px solid ${border || designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.3)}`,
        boxShadow: variant === 'status' ? '0 4px 12px rgba(0,0,0,0.15)' : variant === 'strategy' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', color: color || designSystem.colors.neutral.white }}>
          {icon}
        </span>
      )}
      <span
        style={{
          fontSize: config.fontSize,
          fontWeight: size === 'lg' ? designSystem.typography.fontWeight.extrabold : designSystem.typography.fontWeight.bold,
          color: color || designSystem.colors.neutral.white,
          textTransform: 'uppercase',
          letterSpacing: size === 'lg' ? '0.06em' : '0.04em',
          textShadow: variant === 'status' ? '0 1px 3px rgba(0,0,0,0.3)' : variant === 'strategy' ? '0 1px 2px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}

// Configurações pré-definidas de status
export const statusBadgeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  analysis: {
    label: 'Em Análise',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.tertiary, // Cinza azulado
    border: designSystem.colors.brand.tertiary,
  },
  'in-progress': {
    label: 'Em Andamento',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.accent,
    border: designSystem.colors.brand.accent,
  },
  available: {
    label: 'Disponível',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.secondary,
    border: designSystem.colors.brand.secondary,
  },
  sold: {
    label: 'Vendido',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.semantic.success,
    border: designSystem.colors.semantic.success,
  },
};

// Configurações pré-definidas de estratégia
export const strategyBadgeConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'buy-hold': {
    label: 'Buy & Hold',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.primary,
    border: designSystem.colors.brand.primary,
  },
  'fix-flip': {
    label: 'Fix & Flip',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.tertiary, // Cinza azulado (#6B7C93) - cor terciária da marca
    border: designSystem.colors.brand.tertiary,
  },
  'alojamento-local': {
    label: 'Alojamento Local',
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.accent,
    border: designSystem.colors.brand.accent,
  },
  'rent-to-rent': {
    label: 'Rent-to-Rent',
    color: designSystem.colors.neutral.white,
    bg: '#8b5cf6',
    border: '#8b5cf6',
  },
  desenvolvimento: {
    label: 'Desenvolvimento',
    color: designSystem.colors.neutral.white,
    bg: '#0891b2',
    border: '#0891b2',
  },
  'co-investimento': {
    label: 'Co-Investimento',
    color: designSystem.colors.neutral.white,
    bg: '#e11d48',
    border: '#e11d48',
  },
};

// Componente auxiliar para Status Badge
export function StatusBadge({ status, size = 'md' }: { status: string; size?: BadgeSize }) {
  const config = statusBadgeConfig[status] || {
    label: status,
    color: designSystem.colors.neutral.white,
    bg: designSystem.colors.brand.primary,
    border: designSystem.colors.brand.primary,
  };

  return (
    <Badge
      variant="status"
      size={size}
      label={config.label}
      color={config.color}
      background={config.bg}
      border={config.border}
    />
  );
}

// Componente auxiliar para Strategy Badge
export function StrategyBadge({ strategy, size = 'md' }: { strategy: string; size?: BadgeSize }) {
  const config = strategyBadgeConfig[strategy] || {
    label: strategy,
    color: designSystem.colors.brand.primary,
    bg: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12),
    border: designSystem.colors.brand.primary,
  };

  return (
    <Badge
      variant="strategy"
      size={size}
      label={config.label}
      color={config.color}
      background={config.bg}
      border={config.border}
    />
  );
}
