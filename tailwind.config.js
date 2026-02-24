/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    dark: 'var(--color-primary-dark)',
                    light: 'var(--color-primary-light)',
                    50: 'var(--color-primary-50)',
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    dark: 'var(--color-accent-dark)',
                    light: 'var(--color-accent-light)',
                    50: 'var(--color-accent-50)',
                    100: 'var(--color-accent-100)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    dark: 'var(--color-secondary-dark)',
                    light: 'var(--color-secondary-light)',
                },
            },
            boxShadow: {
                'soft': 'var(--shadow-soft)',
                'soft-lg': 'var(--shadow-soft-lg)',
                'elevated': 'var(--shadow-elevated)',
                'glass': 'var(--shadow-glass)',
                'primary-sm': 'var(--shadow-primary-sm)',
                'primary-md': 'var(--shadow-primary-md)',
                'primary-lg': 'var(--shadow-primary-lg)',
                'primary-xl': 'var(--shadow-primary-xl)',
            },
            borderRadius: {
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
            },
            transitionTimingFunction: {
                'out-expo': 'var(--ease-out-expo)',
                'out-back': 'var(--ease-out-back)',
            },
            transitionDuration: {
                'fast': 'var(--transition-fast)',
                'base': 'var(--transition-base)',
                'slow': 'var(--transition-slow)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(circle at 30% 30%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
