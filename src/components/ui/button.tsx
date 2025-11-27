// HABTA Button Component - Migrated from /primitives/ to /ui/
// Enhanced with Motion animations and design-system tokens
import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { designSystem } from '../design-system';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'style'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'outlineGold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: designSystem.spacing[2],
    borderRadius: designSystem.borderRadius.lg,
    fontWeight: designSystem.typography.fontWeight.semibold,
    transition: designSystem.animations.transition.base,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizeStyles = {
    sm: {
      padding: `${designSystem.spacing[2]} ${designSystem.spacing[5]}`,
      fontSize: designSystem.typography.fontSize.sm,
    },
    md: {
      padding: `${designSystem.spacing[3]} ${designSystem.spacing[6]}`,
      fontSize: designSystem.typography.fontSize.base,
    },
    lg: {
      padding: `${designSystem.spacing[4]} ${designSystem.spacing[8]}`,
      fontSize: designSystem.typography.fontSize.lg,
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: designSystem.colors.gradients.primary,
      color: designSystem.colors.neutral.white,
      boxShadow: designSystem.shadows.md,
    },
    secondary: {
      background: designSystem.colors.gradients.secondary,
      color: designSystem.colors.neutral.white,
      boxShadow: designSystem.shadows.md,
    },
    tertiary: {
      background: designSystem.colors.gradients.tertiary,
      color: designSystem.colors.neutral.white,
      boxShadow: designSystem.shadows.md,
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${designSystem.colors.brand.primary}`,
      color: designSystem.colors.brand.primary,
      boxShadow: 'none',
    },
    outlineGold: {
      background: 'transparent',
      border: `2px solid ${designSystem.colors.brand.secondary}`,
      color: designSystem.colors.brand.secondary,
      boxShadow: 'none',
    },
    ghost: {
      background: 'transparent',
      color: designSystem.colors.brand.primary,
      boxShadow: 'none',
    },
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <motion.button
      style={combinedStyle}
      whileHover={
        disabled
          ? {}
          : {
              y: -2,
              scale: 1.02,
              boxShadow:
                variant === 'primary'
                  ? designSystem.shadows.primaryHover
                  : variant === 'secondary'
                  ? designSystem.shadows.secondaryHover
                  : variant === 'tertiary'
                  ? designSystem.shadows.tertiaryHover
                  : designSystem.shadows.lg,
            }
      }
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </motion.button>
  );
}
