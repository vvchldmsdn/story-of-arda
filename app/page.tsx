import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '반지의 제왕 지도 탐험',
  description: '반지의 제왕 세계관의 지역들을 지도를 통해 탐험하세요!',
  other: {
    'naver-site-verification': 'dbdac0d25f4b9daf8ff5944a4ad5b8634643bad3',
    'google-site-verification': "mxuFLFqYAsu0HWBjQyTl0Mniim654wy_R7NX_qbI9TY",
  },
}

export default function Home() {
  return (
    <>
      <div className='text-eeeeee'>
        <Link href="/home">지도화면으로</Link>
      </div>
    </>
    
  )
}
