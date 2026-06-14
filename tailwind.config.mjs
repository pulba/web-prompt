/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6',
          accent: '#10B981',
        },
        surface: {
          bg: '#FFFFFF',
          card: '#F9FAFB',
          border: '#E5E7EB',
        },
        dark: {
          bg: '#111827',
          card: '#1F2937',
          border: '#374151',
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
