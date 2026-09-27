import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kenyaGreen: '#15803D',
        mpesaGreen: '#16A34A',
        kenyaRed: '#B91C1C',
        safariGold: '#CA8A04',
        slateDark: '#1E293B',
      },
    },
  },
  plugins: [],
};
export default config;
