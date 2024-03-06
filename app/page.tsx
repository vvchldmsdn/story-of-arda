import Image from 'next/image'
import Link from 'next/link';
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'lord of the rings',
  description: '반지의 제왕 세계관의 지역들을 지도를 통해 탐험하세요!'
}

export default function Home() {
  return (
    <>
      <Head>
        <meta name="naver-site-verification" content="dbdac0d25f4b9daf8ff5944a4ad5b8634643bad3" />
      </Head>
      <div className='text-eeeeee'>
        <Link href="/home">지도화면으로</Link>
      </div>
    </>
    
  )
}
