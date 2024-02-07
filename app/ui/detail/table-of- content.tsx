'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function TableOfContent({ contentHeadings }: { contentHeadings: Array<string> }) {
  const headingParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setHeading: any = (idx: number) => {
    const params = new URLSearchParams(headingParams);
    params.set('heading', String(idx));
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col">
      {contentHeadings.map((contentHeading: string, idx: number) => {
        return (
          <div className="mb-8" key={contentHeading}
            onClick={() => setHeading(idx)}
          >{contentHeading}</div>
        )
      })}
    </div>
  )
}