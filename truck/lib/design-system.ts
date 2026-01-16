// FreteConnect 2.0 - Design System Constants

/**
 * Color Palette
 */
export const colors = {
  // Primary
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Accent
  accent: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  // Error
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
}

/**
 * Typography
 */
export const typography = {
  fontFamily: {
    sans: 'var(--font-inter)',
    display: 'var(--font-inter)',
  },
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
}

/**
 * Spacing
 */
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
}

/**
 * Border Radius
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
}

/**
 * Shadows
 */
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  glow: '0 0 20px rgb(59 130 246 / 0.5)',
  glowAccent: '0 0 20px rgb(239 68 68 / 0.5)',
}

/**
 * Glassmorphism Styles
 */
export const glass = {
  light: 'bg-white/10 backdrop-blur-lg border border-white/20',
  medium: 'bg-white/20 backdrop-blur-xl border border-white/30',
  dark: 'bg-black/10 backdrop-blur-lg border border-black/20',
}

/**
 * Gradients
 */
export const gradients = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-400',
  secondary: 'bg-gradient-to-r from-gray-700 to-gray-500',
  accent: 'bg-gradient-to-r from-red-600 to-red-400',
  success: 'bg-gradient-to-r from-green-600 to-green-400',
  warning: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
  premium: 'bg-gradient-to-r from-purple-600 via-pink-500 to-red-500',
  dark: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  hero: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
}

/**
 * Animation Durations
 */
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
}

/**
 * Z-Index Scale
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
}

/**
 * Breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

/**
 * Container Max Widths
 */
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
}

/**
 * Transition Presets
 */
export const transitions = {
  default: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },
  smooth: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
  slow: {
    type: 'spring',
    stiffness: 80,
    damping: 20,
  },
}

/**
 * Animation Variants
 */
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  },
}

/**
 * Status Colors
 */
export const statusColors = {
  ABERTO: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  NEGOCIANDO: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ACEITO: 'bg-green-500/20 text-green-400 border-green-500/30',
  EM_TRANSPORTE: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ENTREGUE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  CANCELADO: 'bg-red-500/20 text-red-400 border-red-500/30',
  PENDENTE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  RECUSADO: 'bg-red-500/20 text-red-400 border-red-500/30',
}

/**
 * Role Badge Colors
 */
export const roleBadgeColors = {
  MOTORISTA: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  CONTRATANTE: 'bg-green-500/20 text-green-400 border-green-500/30',
  ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}
