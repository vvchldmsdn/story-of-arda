import Image from 'next/image'
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'lord of the rings',
  description: '반지의 제왕 세계관의 지역들을 지도를 통해 탐험하세요!'
}

export default function Home() {
  return (
    <div className='text-eeeeee'>
      <Link href="/home">지도화면으로</Link>
    </div>
  )
}
