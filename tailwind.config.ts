import type { Config } from 'tailwindcss';
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'eeeeee': '#EEEEEE',
        'ardayellow': '#FEBF4B',
        'backblack': '#191919',
        'ardagreen': '#154B42',
      },
      aspectRatio: {
        // '3 / 2' 비율을 나타내는 커스텀 유틸리티
        '3/2': '3 / 2',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require('@tailwindcss/aspect-ratio'),]
}
export default config
