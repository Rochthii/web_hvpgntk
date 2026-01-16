/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Colors from UI mockups - Buddhist Khmer Theme
            colors: {
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
                    DEFAULT: '#FFA726',
                },
                secondary: {
                    50: '#EFEBE9',
                    100: '#D7CCC8',
                    200: '#BCAAA4',
                    300: '#A1887F',
                    400: '#8D6E63',
                    500: '#6D4C41',
                    600: '#5D4037',
                    700: '#4E342E',
                    800: '#3E2723',
                    900: '#6B2C2C', // Dark maroon header/footer
                    DEFAULT: '#6B2C2C',
                },
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
                    DEFAULT: '#D4AF37',
                },
                cream: {
                    50: '#FFFBF5',
                    100: '#FFF8ED',
                    200: '#FFF3E0', // Main content background
                    300: '#FFEFD5',
                    400: '#FFEAC2',
                    500: '#F5DEB3',
                    600: '#E8D4A0',
                    700: '#D4C4A8',
                    800: '#C9B896',
                    900: '#B8A687',
                    DEFAULT: '#FFF3E0',
                },
                text: {
                    primary: '#2C1810',
                    secondary: '#5D4037',
                    muted: '#8D6E63',
                    light: '#A1887F',
                },
            },

            // Typography - Unified Noto Stack
            fontFamily: {
                heading: ['"Noto Serif"', '"Noto Serif Khmer"', 'serif'],
                body: ['"Noto Sans"', '"Noto Sans Khmer"', 'sans-serif'],
                sans: ['"Noto Sans"', '"Noto Sans Khmer"', 'sans-serif'],
                serif: ['"Noto Serif"', '"Noto Serif Khmer"', 'serif'],
            },

            // Shadows with warm golden tones
            boxShadow: {
                'gold-sm': '0 0 10px rgba(212, 175, 55, 0.3)',
                'gold-md': '0 0 20px rgba(212, 175, 55, 0.4)',
                'gold-lg': '0 0 30px rgba(212, 175, 55, 0.5)',
                'warm': '0 4px 6px -1px rgba(107, 44, 44, 0.1), 0 2px 4px -1px rgba(107, 44, 44, 0.06)',
            },

            // Container max-widths
            maxWidth: {
                '8xl': '1400px', // Custom for academy layout
            },

            // Z-index scale
            zIndex: {
                'sticky': 1100,
                'modal': 1200,
                'popover': 1300,
                'tooltip': 1400,
            },

            // Animations
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                glow: {
                    '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.4))' },
                    '50%': { filter: 'drop-shadow(0 0 35px rgba(255,215,0,0.7))' },
                },
                twinkle: {
                    '0%, 100%': { opacity: '0.3' },
                    '50%': { opacity: '1' },
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'slide-in-right': 'slideInRight 0.5s ease-out',
                'shimmer': 'shimmer 2s infinite linear',
                'float': 'float 4s ease-in-out infinite',
                'gradient-shift': 'gradientShift 8s ease infinite',
                'glow': 'glow 3s ease-in-out infinite',
                'twinkle': 'twinkle 2s ease-in-out infinite',
                'spin-slow': 'spin 20s linear infinite',
            },

            // Background images
            backgroundImage: {
                'ornate-pattern': "url('/images/pattern-ornate.svg')",
                'temple-hero': "url('/images/temple-hero.jpg')",
            },

            // Text shadows for glow effects
            textShadow: {
                'sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
                'md': '1px 1px 3px rgba(0, 0, 0, 0.75)',
                'lg': '2px 2px 4px rgba(0, 0, 0, 0.85)',
                'glow': '0 0 35px rgba(255,215,0,0.65), 0 0 18px rgba(255,215,0,0.45), 2px 2px 5px rgba(0,0,0,0.85)',
            },

            // Drop shadows
            dropShadow: {
                'gold-sm': '0 0 8px rgba(212, 175, 55, 0.5)',
                'gold-md': '0 0 15px rgba(212, 175, 55, 0.6)',
                'gold-lg': '0 0 25px rgba(212, 175, 55, 0.7)',
                'glow': '0 0 35px rgba(255,215,0,0.65)',
                'primary-glow': '0 5px 18px rgba(255,152,0,0.5)',
                'primary-glow-lg': '0 10px 28px rgba(255,152,0,0.65)',
            },


        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        // Plugin for textShadow utility
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    'text-shadow': (value) => ({
                        textShadow: value,
                    }),
                },
                { values: theme('textShadow') }
            )
        },
    ],
}
