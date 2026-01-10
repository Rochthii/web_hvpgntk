/**
 * HVPGNTK Design System - Main Theme Export
 * Central source of truth for all design tokens
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows } from './shadows';
import { borders } from './borders';

export const theme = {
    colors,
    typography,
    spacing,
    shadows,
    borders,

    // Breakpoints (matching UI mockups)
    breakpoints: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
    },

    // Z-index scale
    zIndex: {
        behind: -1,
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        modal: 1200,
        popover: 1300,
        tooltip: 1400,
        notification: 1500,
    },

    // Transitions
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Container max-widths
    container: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px', // Custom for academy layout
    },
} as const;

export type Theme = typeof theme;

// Re-export individual modules
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { shadows } from './shadows';
export { borders } from './borders';
