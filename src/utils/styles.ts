// Centralized Style Utilities for HABTA
// Consistent styling helpers across all components

import { designSystem } from '../components/design-system';

// Color utilities - todas as cores inline devem usar estes helpers
export const colors = {
  // Brand
  primary: designSystem.colors.brand.primary,
  secondary: designSystem.colors.brand.secondary,
  accent: designSystem.colors.brand.accent,

  // Neutral
  white: designSystem.colors.neutral.white,
  black: designSystem.colors.neutral.black,
  gray: {
    50: designSystem.colors.neutral[50],
    100: designSystem.colors.neutral[100],
    200: designSystem.colors.neutral[200],
    300: designSystem.colors.neutral[300],
    400: designSystem.colors.neutral[400],
    500: designSystem.colors.neutral[500],
    600: designSystem.colors.neutral[600],
    700: designSystem.colors.neutral[700],
    800: designSystem.colors.neutral[800],
    900: designSystem.colors.neutral[900],
  },

  // State colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

// Gradient helpers
export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
  primarySubtle: `linear-gradient(135deg, ${designSystem.helpers.hexToRgba(colors.primary, 0.1)}, ${designSystem.helpers.hexToRgba(colors.secondary, 0.05)})`,
  hero: designSystem.colors.gradients.heroLuxury,
  overlay: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
};

// Shadow utilities
export const shadows = {
  sm: '0 2px 4px rgba(0,0,0,0.06)',
  base: '0 4px 12px rgba(0,0,0,0.08)',
  md: '0 8px 20px rgba(0,0,0,0.1)',
  lg: '0 12px 28px rgba(0,0,0,0.12)',
  xl: '0 20px 40px rgba(0,0,0,0.15)',
  '2xl': '0 24px 48px rgba(0,0,0,0.18)',
  
  // Colored shadows
  primary: `0 8px 20px ${designSystem.helpers.hexToRgba(colors.primary, 0.3)}`,
  primaryHover: `0 12px 28px ${designSystem.helpers.hexToRgba(colors.primary, 0.4)}`,
  secondary: `0 8px 20px ${designSystem.helpers.hexToRgba(colors.secondary, 0.3)}`,
  
  // Focus shadow
  focus: `0 0 0 4px ${designSystem.helpers.hexToRgba(colors.primary, 0.1)}`,
  
  // Inner shadow
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
};

// Border radius
export const radius = {
  none: '0',
  sm: '6px',
  base: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

// Spacing (using design system)
export const spacing = designSystem.spacing;

// Typography
export const typography = {
  fontWeight: designSystem.typography.fontWeight,
  fontSize: designSystem.typography.fontSize,
  lineHeight: designSystem.typography.lineHeight,
  letterSpacing: designSystem.typography.letterSpacing,
};

// Z-index layers
export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  toast: 70,
};

// Backdrop filters
export const backdrop = {
  blur: {
    sm: 'blur(4px)',
    base: 'blur(8px)',
    md: 'blur(12px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
  },
  brightness: {
    dark: 'brightness(0.8)',
    darker: 'brightness(0.6)',
  },
};

// Common component styles
export const componentStyles = {
  // Input field
  input: {
    base: {
      width: '100%',
      padding: '14px 16px',
      border: `2px solid ${colors.gray[200]}`,
      borderRadius: radius.lg,
      fontSize: '1rem',
      color: colors.gray[900],
      background: colors.white,
      transition: 'all 0.2s',
      outline: 'none',
    } as React.CSSProperties,
    
    focus: {
      borderColor: colors.primary,
      boxShadow: shadows.focus,
    } as React.CSSProperties,
    
    error: {
      borderColor: colors.error,
      boxShadow: `0 0 0 4px ${designSystem.helpers.hexToRgba(colors.error, 0.1)}`,
    } as React.CSSProperties,
    
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      background: colors.gray[50],
    } as React.CSSProperties,
  },

  // Button
  button: {
    base: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      padding: '14px 28px',
      border: 'none',
      borderRadius: radius.lg,
      fontWeight: typography.fontWeight.semibold,
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      outline: 'none',
    } as React.CSSProperties,
    
    primary: {
      background: gradients.primary,
      color: colors.white,
      boxShadow: shadows.primary,
    } as React.CSSProperties,
    
    secondary: {
      background: colors.white,
      color: colors.primary,
      border: `2px solid ${colors.gray[200]}`,
      boxShadow: shadows.sm,
    } as React.CSSProperties,
    
    ghost: {
      background: 'transparent',
      color: colors.gray[700],
    } as React.CSSProperties,
  },

  // Card
  card: {
    base: {
      background: colors.white,
      borderRadius: radius['2xl'],
      boxShadow: shadows.lg,
      border: `1px solid ${colors.gray[200]}`,
      overflow: 'hidden',
    } as React.CSSProperties,
    
    padding: {
      sm: spacing[4],
      base: spacing[6],
      lg: spacing[8],
      xl: spacing[10],
    },
  },

  // Badge
  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: radius.md,
      fontSize: '0.875rem',
      fontWeight: typography.fontWeight.semibold,
    } as React.CSSProperties,
    
    primary: {
      background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
      color: colors.primary,
    } as React.CSSProperties,
    
    success: {
      background: designSystem.helpers.hexToRgba(colors.success, 0.1),
      color: colors.success,
    } as React.CSSProperties,
    
    error: {
      background: designSystem.helpers.hexToRgba(colors.error, 0.1),
      color: colors.error,
    } as React.CSSProperties,
    
    warning: {
      background: designSystem.helpers.hexToRgba(colors.warning, 0.1),
      color: colors.warning,
    } as React.CSSProperties,
  },
};

// Layout utilities
export const layout = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${spacing[6]}`,
  } as React.CSSProperties,

  section: {
    padding: `${spacing[20]} 0`,
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gap: spacing[6],
  } as React.CSSProperties,

  flex: {
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as React.CSSProperties,
    
    between: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as React.CSSProperties,
    
    start: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    } as React.CSSProperties,
  },
};

// Helper functions
export const helpers = {
  rgba: designSystem.helpers.hexToRgba,
  
  // Responsive font size
  responsiveSize: (mobile: string, desktop: string) => ({
    fontSize: mobile,
    '@media (min-width: 768px)': {
      fontSize: desktop,
    },
  }),
  
  // Truncate text
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  // Line clamp
  lineClamp: (lines: number) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  }),
};

// Media queries
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  mobile: '@media (max-width: 639px)',
  tablet: '@media (min-width: 640px) and (max-width: 1023px)',
  desktop: '@media (min-width: 1024px)',
};
