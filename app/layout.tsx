import type { Metadata } from 'next';
import { inter, gugi } from './lib/fonts';
import './globals.css';
import {Providers} from "./providers";
import Topnav from './ui/topnav';

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
        <div className="flex-col">
          <div className="flex-none h-24">
            <Topnav></Topnav>
          </div>
          <div>{children}</div>
        </div>
        </Providers>
      </body>
    </html>
  )
}
