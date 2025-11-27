// HABTA Input Component - Migrated from /primitives/ to /ui/
// Enhanced with Motion animations and design-system tokens
import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { designSystem } from '../design-system';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = false, ...props }, ref) => {
    const inputStyle: React.CSSProperties = {
      width: fullWidth ? '100%' : 'auto',
      padding: icon ? '0.875rem 1rem 0.875rem 3rem' : '0.875rem 1rem',
      borderRadius: designSystem.borderRadius.md,
      fontSize: designSystem.typography.fontSize.base,
      border: error
        ? `2px solid ${designSystem.colors.semantic.error}`
        : `1px solid ${designSystem.colors.neutral[300]}`,
      background: designSystem.colors.neutral[50],
      transition: designSystem.animations.transition.base,
      outline: 'none',
      color: designSystem.colors.neutral[950],
    };

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: designSystem.spacing[2],
      width: fullWidth ? '100%' : 'auto',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: designSystem.typography.fontSize.sm,
      fontWeight: designSystem.typography.fontWeight.semibold,
      color: designSystem.colors.brand.primary,
    };

    const errorStyle: React.CSSProperties = {
      fontSize: designSystem.typography.fontSize.sm,
      color: designSystem.colors.semantic.error,
      marginTop: designSystem.spacing[1],
    };

    const iconContainerStyle: React.CSSProperties = {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: designSystem.colors.neutral[500],
      pointerEvents: 'none',
    };

    return (
      <div style={containerStyle}>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={{ position: 'relative', width: '100%' }}>
          {icon && <div style={iconContainerStyle}>{icon}</div>}
          <motion.input
            ref={ref}
            style={inputStyle}
            whileFocus={{
              borderColor: designSystem.colors.brand.primary,
              boxShadow: `0 0 0 3px ${designSystem.helpers.hexToRgba(
                designSystem.colors.brand.primary,
                0.1
              )}`,
            }}
            {...props}
          />
        </div>
        {error && <span style={errorStyle}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
