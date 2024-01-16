import { Inter, Gugi, Fira_Sans } from "next/font/google";

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const gugi = Gugi({
  subsets: ['latin'],
  weight: ['400',],
  display: 'swap',
});

export const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});