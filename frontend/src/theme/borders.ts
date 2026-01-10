/**
 * HVPGNTK Design System - Borders
 */

export const borders = {
    // Border Widths
    widths: {
        none: '0',
        thin: '1px',
        base: '2px',
        thick: '4px',
        ornate: '8px', // For decorative borders
    },

    // Border Radius
    radius: {
        none: '0',
        sm: '0.125rem',   // 2px
        base: '0.25rem',  // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
        full: '9999px',
    },

    // Border Styles (for ornamental frames)
    styles: {
        solid: 'solid',
        dashed: 'dashed',
        dotted: 'dotted',
        double: 'double',
        ornate: 'url("/images/border-ornate-gold.svg")', // SVG pattern
    },
} as const;

export type Borders = typeof borders;
