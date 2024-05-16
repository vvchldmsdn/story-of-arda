import type { Metadata } from 'next';
import { notoSansKr } from './lib/fonts';
import './globals.css';
import {Providers} from "./providers";
import Topnav from './ui/topnav';
import Head from 'next/head';

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
      <Head>
        <meta name="naver-site-verification" content="dbdac0d25f4b9daf8ff5944a4ad5b8634643bad3" />
      </Head>
      <body className={notoSansKr.className}>
        <Providers>
        <div className="flex-col">
          <div>{children}</div>
        </div>
        </Providers>
      </body>
    </html>
  )
}
