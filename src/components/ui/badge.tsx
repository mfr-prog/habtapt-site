// HABTA Badge Component - Migrated from /primitives/ to /ui/
// Enhanced with Motion animations and design-system tokens
import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { designSystem } from '../design-system';

interface BadgeProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  ...props
}: BadgeProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: designSystem.spacing[2],
    borderRadius: designSystem.borderRadius.full,
    fontWeight: designSystem.typography.fontWeight.semibold,
    transition: designSystem.animations.transition.base,
    textTransform: 'uppercase',
    letterSpacing: designSystem.typography.letterSpacing.wide,
  };

  const sizeStyles = {
    sm: {
      padding: '0.25rem 0.75rem',
      fontSize: designSystem.typography.fontSize.xs,
    },
    md: {
      padding: '0.375rem 0.875rem',
      fontSize: designSystem.typography.fontSize.sm,
    },
    lg: {
      padding: '0.5rem 1rem',
      fontSize: designSystem.typography.fontSize.base,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.12),
      color: designSystem.colors.brand.primary,
      border: `1.5px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.25)}`,
    },
    secondary: {
      background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.12),
      color: designSystem.colors.brand.secondary,
      border: `1.5px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.25)}`,
    },
    tertiary: {
      background: designSystem.helpers.hexToRgba(designSystem.colors.brand.tertiary, 0.12),
      color: designSystem.colors.brand.tertiary,
      border: `1.5px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.tertiary, 0.25)}`,
    },
    accent: {
      background: designSystem.helpers.hexToRgba(designSystem.colors.brand.accent, 0.12),
      color: designSystem.colors.brand.accent,
      border: `1.5px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.accent, 0.25)}`,
    },
    success: {
      background: designSystem.colors.semantic.successLight,
      color: designSystem.colors.semantic.success,
      border: `1.5px solid ${designSystem.colors.semantic.success}`,
    },
    warning: {
      background: designSystem.colors.semantic.warningLight,
      color: designSystem.colors.semantic.warning,
      border: `1.5px solid ${designSystem.colors.semantic.warning}`,
    },
    error: {
      background: designSystem.colors.semantic.errorLight,
      color: designSystem.colors.semantic.error,
      border: `1.5px solid ${designSystem.colors.semantic.error}`,
    },
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <motion.div
      style={combinedStyle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {icon && icon}
      {children}
    </motion.div>
  );
}
