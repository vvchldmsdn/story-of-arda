import type { Metadata } from 'next';
import { inter, gugi } from './lib/fonts';
import './globals.css';
import {Providers} from "./providers";

export const metadata: Metadata = {
  title: 'Story of Arda',
  description: 'Wiki of Legendarium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={gugi.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
