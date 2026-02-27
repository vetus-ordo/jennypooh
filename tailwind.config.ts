import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'sans-serif'],
        body:   ['var(--font-body)', 'sans-serif'],
        cinzel: ['var(--font-cinzel)', 'serif'],
      },
      keyframes: {
        aurora: {
          '0%':   { opacity: '0.6', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '1',   transform: 'scale(1.06) translateY(-12px)' },
        },
        twinkle: {
          '0%':   { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        aurora:  'aurora 8s ease-in-out infinite alternate',
        twinkle: 'twinkle 4s ease-in-out infinite alternate',
        float:   'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
