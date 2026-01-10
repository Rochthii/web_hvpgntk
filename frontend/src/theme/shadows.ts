/**
 * HVPGNTK Design System - Shadows
 * Warm golden shadows to match Buddhist theme
 */

export const shadows = {
    none: 'none',
    xs: '0 1px 2px 0 rgba(107, 44, 44, 0.05)',
    sm: '0 1px 3px 0 rgba(107, 44, 44, 0.1), 0 1px 2px 0 rgba(107, 44, 44, 0.06)',
    base: '0 4px 6px -1px rgba(107, 44, 44, 0.1), 0 2px 4px -1px rgba(107, 44, 44, 0.06)',
    md: '0 10px 15px -3px rgba(107, 44, 44, 0.1), 0 4px 6px -2px rgba(107, 44, 44, 0.05)',
    lg: '0 20px 25px -5px rgba(107, 44, 44, 0.1), 0 10px 10px -5px rgba(107, 44, 44, 0.04)',
    xl: '0 25px 50px -12px rgba(107, 44, 44, 0.25)',
    '2xl': '0 35px 60px -15px rgba(107, 44, 44, 0.3)',

    // Golden glow effects
    gold: {
        sm: '0 0 10px rgba(212, 175, 55, 0.3)',
        md: '0 0 20px rgba(212, 175, 55, 0.4)',
        lg: '0 0 30px rgba(212, 175, 55, 0.5)',
    },

    // Inner shadows
    inner: 'inset 0 2px 4px 0 rgba(107, 44, 44, 0.06)',
} as const;

export type Shadows = typeof shadows;
