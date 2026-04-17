'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function TableOfContent({ contentHeadings }: { contentHeadings: Array<string> }) {
  const headingParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const heading = Number(headingParams.get('heading') || '0');
  const selectedIdx = Number.isInteger(heading) && heading >= 0 && heading < contentHeadings.length ? heading : 0;

  if (contentHeadings.length === 0) {
    return null;
  }

  const setHeading = (idx: number) => {
    const params = new URLSearchParams(headingParams);
    params.set('heading', String(idx));
    replace(`${pathname}?${params.toString()}`);
  };

  const getHeadingText = (contentHeading: string) => {
    return contentHeading.replace(/^\*\*/, '').replace(/\*\*$/, '');
  };

  return (
    <nav className="rounded-lg border border-[#D6A526]/25 bg-[#121812]/90 p-4 text-[#F5F0DF] shadow-xl shadow-black/25">
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#D6A526]">목차</p>
      <div className="flex max-h-[calc(100vh-9rem)] flex-col gap-2 overflow-auto pr-1">
        {contentHeadings.map((contentHeading: string, idx: number) => {
          return (
            <button
              type="button"
              className={clsx(
                "rounded-md border px-3 py-3 text-left text-sm leading-5 transition",
                {
                  "border-[#D6A526] bg-[#D6A526] text-[#0F1411]": selectedIdx === idx
                },
                {
                  "border-[#F5F0DF]/10 text-[#F5F0DF]/72 hover:border-[#D6A526]/60 hover:text-[#F5F0DF]": selectedIdx !== idx
                }
              )}
              key={contentHeading}
              onClick={() => setHeading(idx)}
            >
              {getHeadingText(contentHeading)}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
