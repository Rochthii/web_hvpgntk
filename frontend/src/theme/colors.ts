/**
 * HVPGNTK Design System - Color Tokens
 * Extracted from UI mockups - Buddhist Khmer Academy Theme
 */

export const colors = {
    // Primary Colors - Golden/Orange
    primary: {
        50: '#FFF8E1',
        100: '#FFECB3',
        200: '#FFE082',
        300: '#FFD54F',
        400: '#FFCA28',
        500: '#FFA726', // Main orange CTA
        600: '#FB8C00',
        700: '#F57C00',
        800: '#EF6C00',
        900: '#E65100',
    },

    // Secondary Colors - Maroon/Brown
    secondary: {
        50: '#EFEBE9',
        100: '#D7CCC8',
        200: '#BCAAA4',
        300: '#A1887F',
        400: '#8D6E63',
        500: '#6D4C41', // Main maroon
        600: '#5D4037',
        700: '#4E342E',
        800: '#3E2723',
        900: '#6B2C2C', // Dark maroon header/footer
    },

    // Gold/Ornamental
    gold: {
        50: '#FFFDF7',
        100: '#FFF9E6',
        200: '#FFF4CC',
        300: '#FFECB3',
        400: '#FFE499',
        500: '#D4AF37', // Classic gold
        600: '#C5A028',
        700: '#B8941F',
        800: '#9A7D1A',
        900: '#8B6914',
    },

    // Cream/Beige Background
    cream: {
        50: '#FFFBF5',
        100: '#FFF8ED',
        200: '#FFF3E0', // Main content background
        300: '#FFEFD5',
        400: '#FFEAC2',
        500: '#F5DEB3', // Wheat/Beige
        600: '#E8D4A0',
        700: '#D4C4A8',
        800: '#C9B896',
        900: '#B8A687',
    },

    // Text Colors
    text: {
        primary: '#2C1810', // Dark brown
        secondary: '#5D4037',
        muted: '#8D6E63',
        light: '#A1887F',
        white: '#FFFFFF',
        cream: '#FFF8ED',
    },

    // UI States
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Neutrals
    neutral: {
        white: '#FFFFFF',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
        black: '#000000',
    },

    // Background Overlays
    overlay: {
        light: 'rgba(255, 255, 255, 0.9)',
        medium: 'rgba(255, 255, 255, 0.7)',
        dark: 'rgba(44, 24, 16, 0.8)',
        darkStrong: 'rgba(44, 24, 16, 0.9)',
    },
} as const;

export type ColorToken = typeof colors;
