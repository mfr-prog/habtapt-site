// Primitive: Animated Button - Ultra Simplified v5.0
import React, { ButtonHTMLAttributes, CSSProperties } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { colors, componentStyles, shadows } from '../../utils/styles';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function AnimatedButton(props: AnimatedButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    isLoading = false,
    fullWidth = false,
    disabled = false,
    children,
    style,
    ...otherProps
  } = props;

  const isDisabled = disabled || isLoading;

  // Simple style objects - no functions, no complexity
  const baseStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    fontWeight: 600,
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };

  const sizeStyle: CSSProperties = 
    size === 'sm' ? { padding: '10px 20px', fontSize: '0.875rem', gap: '8px' } :
    size === 'lg' ? { padding: '16px 32px', fontSize: '1.125rem', gap: '14px' } :
    { padding: '14px 28px', fontSize: '1rem', gap: '12px' };

  const variantStyle: CSSProperties = 
    variant === 'secondary' ? {
      background: colors.white,
      color: colors.primary,
      border: `2px solid ${colors.gray[200]}`,
      boxShadow: shadows.sm,
    } :
    variant === 'outline' ? {
      background: colors.white,
      color: colors.gray[700],
      border: `1px solid ${colors.gray[300]}`,
      boxShadow: shadows.sm,
    } :
    variant === 'ghost' ? {
      background: 'transparent',
      color: colors.gray[700],
      border: 'none',
      boxShadow: 'none',
    } :
    variant === 'danger' ? {
      background: colors.error,
      color: colors.white,
      boxShadow: `0 8px 20px ${colors.error}30`,
    } :
    {
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
      color: colors.white,
      boxShadow: shadows.primary,
    };

  const finalStyle: CSSProperties = {
    ...baseStyle,
    ...variantStyle,
    ...sizeStyle,
    width: fullWidth ? '100%' : 'auto',
    opacity: isDisabled ? 0.6 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const iconSize = size === 'sm' ? 18 : 20;

  return (
    <motion.button
      {...otherProps}
      disabled={isDisabled}
      style={finalStyle}
      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
    >
      {isLoading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle 
                cx="10" 
                cy="10" 
                r="8" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeDasharray="12 38" 
              />
            </svg>
          </motion.div>
          <span>Carregando...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={iconSize} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={iconSize} />}
        </>
      )}
    </motion.button>
  );
}
