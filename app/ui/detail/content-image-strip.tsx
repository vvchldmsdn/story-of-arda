'use client';

import { ScrollShadow, Image } from "@nextui-org/react";
import { useState } from "react";
import clsx from "clsx";

type ContentImage = {
  url: string;
};

export default function ContentImageStrip({ images }: { images: ContentImage[] }) {
  const [isClosed, setIsClosed] = useState<boolean>(false);

  if (images.length === 0) {
    return null;
  }

  const handleClick = () => {
    setIsClosed((prev) => !prev);
  };

  return (
    <div className="rounded-xl border border-[#E7C86A]/32 bg-[#0B100E]/94 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.32)] ring-1 ring-white/10">
      <ScrollShadow
        orientation="horizontal"
        hideScrollBar
        className={clsx(
          "flex-none transition-height duration-700 ease-in-out",
          isClosed ? "h-0 overflow-hidden" : "h-48",
        )}
      >
        <div className="flex flex-row flex-nowrap gap-4">
          {images.map((image) => {
            return (
              <Image
                src={image.url}
                alt="Detail image"
                isZoomed
                key={image.url}
                style={{ minWidth: "260px" }}
                className="max-h-[180px] rounded-md object-cover"
                width={260}
              />
            );
          })}
        </div>
      </ScrollShadow>
      <button
        type="button"
        className="mt-3 w-full text-center text-sm text-[#F7F1DC]/78 hover:text-[#FFF8DE]"
        onClick={handleClick}
      >
        이미지 {isClosed ? "열기" : "접기"}
      </button>
    </div>
  );
}
