import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navyBlue: '#60a5fa',
        crimsonRed: '#f87171',
        goldYellow: '#FBBF24',
        skyBlue: '#60A5FA',
        white: '#FFFFFF',
        emeraldGreen: '#10B981',
        lightGray: '#F3F4F6'

      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
