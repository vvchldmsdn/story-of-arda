'use client';

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import clsx from "clsx";

export default function TableOfContent({ contentHeadings }: { contentHeadings: Array<string> }) {
  const headingParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const heading = Number(headingParams.get("heading") || "0");
  const selectedIdx = Number.isInteger(heading) && heading >= 0 && heading < contentHeadings.length ? heading : 0;

  if (contentHeadings.length === 0) {
    return null;
  }

  const setHeading = (idx: number) => {
    const params = new URLSearchParams(headingParams);
    params.set("heading", String(idx));
    replace(`${pathname}?${params.toString()}`);
  };

  const getHeadingText = (contentHeading: string) => {
    return contentHeading.replace(/^\*\*/, "").replace(/\*\*$/, "");
  };

  return (
    <nav className="rounded-xl border border-[#E7C86A]/32 bg-[#0B100E]/96 p-4 text-[#F7F1DC] shadow-[0_18px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/10">
      <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#E7C86A]">목차</p>
      <div className="flex max-h-[calc(100vh-9rem)] flex-col gap-2 overflow-auto pr-1">
        {contentHeadings.map((contentHeading: string, idx: number) => {
          return (
            <button
              type="button"
              className={clsx(
                "rounded-md border px-3 py-3 text-left text-sm leading-5 transition",
                selectedIdx === idx
                  ? "border-[#E7C86A] bg-[#E7C86A] text-[#0B100E]"
                  : "border-[#F7F1DC]/18 bg-[#F7F1DC]/5 text-[#F7F1DC]/76 hover:border-[#E7C86A]/65 hover:text-[#FFF8DE]",
              )}
              key={contentHeading}
              onClick={() => setHeading(idx)}
            >
              {getHeadingText(contentHeading)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
