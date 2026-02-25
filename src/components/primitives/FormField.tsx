'use client';

// Primitive: Reusable Form Field Component
import React, { useState, InputHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { colors, componentStyles, shadows, radius } from '../../utils/styles';
import { animations } from '../../utils/animations';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
  showPasswordToggle?: boolean;
}

export function FormField({
  label,
  error,
  icon: Icon,
  helperText,
  type = 'text',
  showPasswordToggle = false,
  disabled = false,
  ...props
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const hasError = !!error;

  return (
    <motion.div 
      variants={animations.fadeInUp}
      style={{ width: '100%' }}
    >
      {label && (
        <label
          htmlFor={props.id}
          style={{
            display: 'block',
            marginBottom: '8px',
            color: hasError ? colors.error : colors.gray[700],
            fontWeight: 600,
            fontSize: '0.875rem',
            transition: 'color 0.2s',
          }}
        >
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: hasError ? colors.error : isFocused ? colors.primary : colors.gray[400],
              pointerEvents: 'none',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={20} />
          </div>
        )}
        
        <input
          {...props}
          type={inputType}
          disabled={disabled}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            ...componentStyles.input.base,
            paddingLeft: Icon ? '48px' : '16px',
            paddingRight: showPasswordToggle ? '48px' : '16px',
            borderColor: hasError ? colors.error : isFocused ? colors.primary : colors.gray[200],
            boxShadow: hasError 
              ? `0 0 0 4px ${colors.error}10`
              : isFocused 
                ? shadows.focus 
                : 'none',
            ...(disabled && componentStyles.input.disabled),
          }}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: colors.gray[400],
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s',
              opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => !disabled && (e.currentTarget.style.color = colors.primary)}
            onMouseLeave={(e) => !disabled && (e.currentTarget.style.color = colors.gray[400])}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '6px',
            fontSize: '0.8125rem',
            color: colors.error,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <span>⚠</span>
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p
          style={{
            marginTop: '6px',
            fontSize: '0.8125rem',
            color: colors.gray[500],
          }}
        >
          {helperText}
        </p>
      )}
    </motion.div>
  );
}
