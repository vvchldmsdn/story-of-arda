'use client'

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
    <div className="rounded-lg border border-[#D6A526]/25 bg-[#121812]/80 p-3 shadow-xl shadow-black/20">
      <ScrollShadow
        orientation="horizontal"
        hideScrollBar
        className={clsx(
          "flex-none transition-height duration-700 ease-in-out",
          {
            "h-0 overflow-hidden": isClosed
          },
          {
            "h-48": !isClosed
          }
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
                style={{ minWidth: '260px' }}
                className="max-h-[180px] rounded-md object-cover"
                width={260}
              ></Image>
            )
          })}
        </div>
      </ScrollShadow>
      <p
        className="mt-3 text-center text-sm text-[#F5F0DF]/74 hover:cursor-pointer hover:text-[#F5F0DF]"
        onClick={handleClick}
      >이미지 창 {isClosed ? '열기' : '닫기'}</p>
    </div>
  )
}
