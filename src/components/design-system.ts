// HABTA Design System - Design Primitives & Tokens
// Sistema de design completo com cores, tipografia, espaçamento e animações

// ========== CORES ==========
export const colors = {
  // Cores Principais - Identidade HABTA Luxury
  brand: {
    primary: '#1A3E5C',      // Azul Petróleo (principal do logo)
    primaryHover: '#142f47',
    primaryLight: '#234d6f',
    primaryLighter: '#2d5a7d',
    primaryDark: '#0f2738',
    
    secondary: '#B8956A',     // Dourado Sóbrio (luxury premium)
    secondaryHover: '#a37d4f',
    secondaryLight: '#C9A872',
    secondaryLighter: '#d4b485',
    secondaryDark: '#8f7350',
    
    tertiary: '#6B7C93',      // Cinza Azulado (profissional)
    tertiaryHover: '#596a7f',
    tertiaryLight: '#8396AD',
    tertiaryLighter: '#98a7ba',
    tertiaryDark: '#4d5c6f',
    
    accent: '#C9A872',        // Bronze Claro (highlight)
    accentLight: '#dbbf90',
    accentDark: '#b8956a',
  },
  
  // Gradientes - Identidade Visual Luxury
  gradients: {
    primary: 'linear-gradient(135deg, #1A3E5C 0%, #234d6f 100%)',
    secondary: 'linear-gradient(135deg, #B8956A 0%, #C9A872 100%)',
    tertiary: 'linear-gradient(135deg, #6B7C93 0%, #8396AD 100%)',
    hero: 'linear-gradient(135deg, #1A3E5C 0%, #2d4a5f 50%, #3d5a6f 100%)',
    heroLuxury: 'linear-gradient(135deg, #1A3E5C 0%, #B8956A 100%)',
    heroSubtle: 'linear-gradient(135deg, #1A3E5C 0%, #6B7C93 100%)',
    accent: 'linear-gradient(135deg, #B8956A 0%, #C9A872 100%)',
    accentReverse: 'linear-gradient(135deg, #C9A872 0%, #B8956A 100%)',
    subtle: 'linear-gradient(180deg, #ffffff 0%, #F9FAFC 100%)',
    overlay: 'linear-gradient(180deg, rgba(26, 62, 92, 0) 0%, rgba(26, 62, 92, 0.8) 100%)',
    overlayGold: 'linear-gradient(180deg, rgba(184, 149, 106, 0) 0%, rgba(184, 149, 106, 0.6) 100%)',
  },
  
  // Neutros - Hierarquia Visual Premium
  neutral: {
    white: '#ffffff',
    50: '#F9FAFC',
    100: '#F5F6F8',
    200: '#E9EDF2',
    300: '#E8EAED',
    400: '#B4B8C5',
    500: '#A8B2C1',
    600: '#64748b',
    700: '#475569',
    800: '#334155',
    900: '#1e293b',
    950: '#0F1729',
  },
  
  // Semânticos
  semantic: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
  
  // Estados
  state: {
    hover: 'rgba(26, 62, 92, 0.08)',
    active: 'rgba(26, 62, 92, 0.12)',
    disabled: 'rgba(26, 62, 92, 0.4)',
    focus: 'rgba(26, 62, 92, 0.2)',
  },
  
  // Estratégias de Investimento - Cores Distintivas
  strategy: {
    rentToRent: '#8b5cf6',      // Roxo vibrante
    development: '#0891b2',      // Cyan/Turquesa
    coInvestment: '#e11d48',     // Vermelho rosa
  },
  
  // Cores de Marca Externa
  external: {
    whatsappPrimary: '#25D366',
    whatsappDark: '#128C7E',
    notificationRed: '#FF4444',
  },
  
  // Aliases para facilitar acesso (backward compatibility)
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

// ========== TIPOGRAFIA ==========
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Roboto", system-ui, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  
  fontSize: {
    '11.7': '0.731rem', // ~11.7px
    '12.8': '0.8rem',   // ~12.8px
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    '15': '0.9375rem',  // 15px
    '15.2': '0.95rem',  // ~15.2px
    base: '1rem',       // 16px
    '17': '1.0625rem',  // 17px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.7,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ========== ESPAÇAMENTO ==========
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  md: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
} as const;

// ========== BORDAS ==========
export const borderRadius = {
  none: '0',
  sm: '0.375rem',
  base: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
  full: '9999px',
} as const;

export const borderWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

// ========== SOMBRAS ==========
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(26, 62, 92, 0.05)',
  base: '0 1px 3px 0 rgba(26, 62, 92, 0.1), 0 1px 2px -1px rgba(26, 62, 92, 0.1)',
  md: '0 4px 6px -1px rgba(26, 62, 92, 0.1), 0 2px 4px -2px rgba(26, 62, 92, 0.1)',
  lg: '0 10px 15px -3px rgba(26, 62, 92, 0.1), 0 4px 6px -4px rgba(26, 62, 92, 0.1)',
  xl: '0 20px 25px -5px rgba(26, 62, 92, 0.1), 0 8px 10px -6px rgba(26, 62, 92, 0.1)',
  '2xl': '0 25px 50px -12px rgba(26, 62, 92, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(26, 62, 92, 0.06)',
  
  // Sombras coloridas para hover states
  primaryHover: '0 8px 20px rgba(26, 62, 92, 0.25)',
  secondaryHover: '0 8px 20px rgba(184, 149, 106, 0.35)',
  tertiaryHover: '0 8px 20px rgba(107, 124, 147, 0.25)',
  accentHover: '0 8px 20px rgba(201, 168, 114, 0.35)',
  luxuryGlow: '0 0 40px rgba(184, 149, 106, 0.3), 0 8px 20px rgba(184, 149, 106, 0.25)',
  focus: '0 0 0 3px rgba(184, 149, 106, 0.3)',
  focusPrimary: '0 0 0 3px rgba(26, 62, 92, 0.3)',
} as const;

// ========== ANIMAÇÕES ==========
export const animations = {
  // Durações
  duration: {
    instant: '50ms',
    fast: '150ms',
    base: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '750ms',
  },
  
  // Timing Functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
  
  // Animações prontas
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    all: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Delays para animações sequenciais
  delay: {
    0: '0ms',
    50: '50ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
  },
} as const;

// ========== BREAKPOINTS ==========
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ========== Z-INDEX ==========
export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
} as const;

// ========== COMPONENTES DE ESTILO ==========
export const components = {
  // Botões
  button: {
    base: {
      padding: '0.75rem 1.5rem',
      borderRadius: borderRadius.lg,
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      transition: animations.transition.base,
      cursor: 'pointer',
    },
    primary: {
      background: colors.gradients.primary,
      color: colors.neutral.white,
      boxShadow: shadows.md,
      hover: {
        boxShadow: shadows.primaryHover,
        transform: 'translateY(-2px)',
      },
    },
    secondary: {
      background: colors.gradients.secondary,
      color: colors.brand.primary,
      boxShadow: shadows.md,
      hover: {
        boxShadow: shadows.secondaryHover,
        transform: 'translateY(-2px)',
      },
    },
    tertiary: {
      background: colors.gradients.tertiary,
      color: colors.neutral.white,
      boxShadow: shadows.md,
      hover: {
        boxShadow: shadows.tertiaryHover,
        transform: 'translateY(-2px)',
      },
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${colors.brand.primary}`,
      color: colors.brand.primary,
      hover: {
        background: colors.brand.primary,
        color: colors.neutral.white,
      },
    },
    outlineGold: {
      background: 'transparent',
      border: `2px solid ${colors.brand.secondary}`,
      color: colors.brand.secondary,
      hover: {
        background: colors.brand.secondary,
        color: colors.neutral.white,
      },
    },
  },
  
  // Cards
  card: {
    base: {
      background: colors.neutral.white,
      borderRadius: borderRadius['2xl'],
      padding: spacing[8],
      boxShadow: shadows.md,
      border: `1px solid ${colors.neutral[200]}`,
      transition: animations.transition.base,
    },
    hover: {
      boxShadow: shadows.xl,
      transform: 'translateY(-8px) scale(1.02)',
    },
  },
  
  // Inputs
  input: {
    base: {
      padding: '0.875rem 1rem',
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.base,
      border: `1px solid ${colors.neutral[300]}`,
      background: colors.neutral[50],
      transition: animations.transition.base,
      focus: {
        outline: `2px solid ${colors.brand.primary}`,
        outlineOffset: '2px',
      },
    },
  },
  
  // Badge
  badge: {
    base: {
      padding: '0.375rem 0.875rem',
      borderRadius: borderRadius.full,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
    },
    primary: {
      background: `rgba(26, 62, 92, 0.1)`,
      color: colors.brand.primary,
      border: `1px solid rgba(26, 62, 92, 0.2)`,
    },
    secondary: {
      background: `rgba(184, 149, 106, 0.1)`,
      color: colors.brand.secondary,
      border: `1px solid rgba(184, 149, 106, 0.2)`,
    },
    tertiary: {
      background: `rgba(107, 124, 147, 0.1)`,
      color: colors.brand.tertiary,
      border: `1px solid rgba(107, 124, 147, 0.2)`,
    },
  },
} as const;

// ========== HELPERS ==========
export const helpers = {
  // Gerar rgba a partir de hex - com validação
  hexToRgba: (hex: string | undefined, alpha: number) => {
    if (!hex || typeof hex !== 'string') {
      console.warn('hexToRgba: invalid hex color provided', hex);
      return `rgba(0, 0, 0, ${alpha})`;
    }
    const cleanHex = hex.startsWith('#') ? hex : '#' + hex;
    const r = parseInt(cleanHex.slice(1, 3), 16);
    const g = parseInt(cleanHex.slice(3, 5), 16);
    const b = parseInt(cleanHex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
  
  // Truncate text
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  
  // Centralizar absoluto
  absoluteCenter: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  
  // Aspect ratios
  aspectRatio: {
    square: '1/1',
    video: '16/9',
    portrait: '3/4',
    landscape: '4/3',
  },
  
  // Glass effect
  glass: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid rgba(255, 255, 255, 0.3)`,
  },
  
  glassDark: {
    background: 'rgba(26, 62, 92, 0.7)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid rgba(255, 255, 255, 0.1)`,
  },
} as const;

// ========== EXPORT TUDO ==========
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  borderWidth,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components,
  helpers,
} as const;

export default designSystem;
