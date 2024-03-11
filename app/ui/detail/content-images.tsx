'use client'

import { ScrollShadow, Image } from "@nextui-org/react";
import { useState } from "react";
import clsx from "clsx";

export default function ContentImages({ subject }: { subject: string }) {
  const [isClosed, setIsClosed] = useState<Boolean>(false);
  // const images = await fetchContentImages(subject);
  // console.log(images);

  const size = 10;
  const tmp = Array.from({ length: size }, (v, i) => ({ key: i + 1 }));

  const handleClick = () => {
    setIsClosed(!isClosed)
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
          {tmp.map((item) => {
            return (
              <Image src="/tmp.jpg" alt="asdf"
                isZoomed
                key={item.key}
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

