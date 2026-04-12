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
    <div>
      <ScrollShadow
        orientation="horizontal"
        hideScrollBar
        className={clsx(
          "mx-6 flex-none transition-height duration-700 ease-in-out",
          {
            "h-0 overflow-hidden": isClosed
          },
          {
            "h-48": !isClosed
          }
        )}
        style={{ width: 'calc(100vw - 24rem)' }}
      >
        <div className="flex flex-row flex-nowrap gap-4">
          {images.map((image) => {
            return (
              <Image
                src={image.url}
                alt="Detail image"
                isZoomed
                key={image.url}
                style={{ minWidth: '300px' }}
                className="object-cover rounded-xl max-h-[180px]"
                width={300}
              ></Image>
            )
          })}
        </div>
      </ScrollShadow>
      <p
        className="text-eeeeee hover:cursor-pointer mx-6 text-center"
        onClick={handleClick}
      >이미지 창 {isClosed ? '열기' : '닫기'}</p>
    </div>
  )
}
