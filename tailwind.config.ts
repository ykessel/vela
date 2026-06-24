import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './emails/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background:   'rgb(var(--color-background) / <alpha-value>)',
        surface:      'rgb(var(--color-surface) / <alpha-value>)',
        'surface-2':  'rgb(var(--color-surface-2) / <alpha-value>)',
        border:       'rgb(var(--color-border) / <alpha-value>)',
        text:         'rgb(var(--color-text) / <alpha-value>)',
        muted:        'rgb(var(--color-muted) / <alpha-value>)',
        accent:       'rgb(var(--color-accent) / <alpha-value>)',
        'accent-fg':  'rgb(var(--color-accent-fg) / <alpha-value>)',
        success:      '#16a34a',
        danger:       '#dc2626',
        warning:      '#d97706',
      },
      fontFamily: {
        sans:  ['var(--font-hanken)',     'system-ui',    'sans-serif'],
        serif: ['var(--font-newsreader)', 'Georgia',      'serif'],
        mono:  ['var(--font-space-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card:        '0 1px 3px rgb(0 0 0 / 0.06), 0 0 0 1px rgb(var(--color-border) / 0.5)',
        'card-hover':'0 6px 24px rgb(0 0 0 / 0.10), 0 0 0 1px rgb(var(--color-border) / 0.8)',
        modal:       '0 24px 64px rgb(0 0 0 / 0.20)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
