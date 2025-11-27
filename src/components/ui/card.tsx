// HABTA Card Component - Migrated from /primitives/ to /ui/
// Enhanced with Motion animations and design-system tokens
import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { designSystem } from '../design-system';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'style'> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass';
  padding?: keyof typeof designSystem.spacing;
  hover?: boolean;
  gradient?: boolean;
}

export function Card({
  children,
  variant = 'default',
  padding = '8',
  hover = true,
  gradient = false,
  ...props
}: CardProps) {
  const baseStyle: React.CSSProperties = {
    background: designSystem.colors.neutral.white,
    borderRadius: designSystem.borderRadius['2xl'],
    padding: designSystem.spacing[padding],
    transition: designSystem.animations.transition.base,
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      boxShadow: designSystem.shadows.sm,
      border: `1px solid ${designSystem.colors.neutral[200]}`,
    },
    bordered: {
      border: `1px solid ${designSystem.colors.brand.primary}20`,
      boxShadow: 'none',
    },
    elevated: {
      boxShadow: designSystem.shadows.lg,
      border: 'none',
    },
    glass: {
      ...designSystem.helpers.glass,
      boxShadow: designSystem.shadows.md,
    },
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyle,
    ...variantStyles[variant],
  };

  return (
    <motion.div
      style={combinedStyle}
      whileHover={
        hover
          ? {
              y: -8,
              scale: 1.02,
              boxShadow: designSystem.shadows.xl,
            }
          : {}
      }
      {...props}
    >
      {gradient && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: designSystem.colors.gradients.accent,
            filter: 'blur(60px)',
            opacity: 0.3,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </motion.div>
  );
}

// Optional: Keep shadcn-style subcomponents for compatibility
export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={className}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: designSystem.spacing[3],
        marginBottom: designSystem.spacing[4]
      }}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={className}
      style={{ 
        fontSize: designSystem.typography.fontSize['2xl'],
        fontWeight: designSystem.typography.fontWeight.semibold,
        color: designSystem.colors.brand.primary
      }}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={className}
      style={{ 
        fontSize: designSystem.typography.fontSize.sm,
        color: designSystem.colors.neutral[600]
      }}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div 
      data-slot="card-content" 
      className={className}
      {...props} 
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center',
        marginTop: designSystem.spacing[4]
      }}
      {...props}
    />
  );
}

export function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={className}
      {...props}
    />
  );
}
