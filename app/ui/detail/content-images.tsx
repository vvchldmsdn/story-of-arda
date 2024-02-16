import { ScrollShadow, Image } from "@nextui-org/react";

export default function ContentImages() {
  const size = 10;
  const tmp = Array.from({ length: size }, (v, i) => ({ key: i + 1 }));

  return (
    <ScrollShadow orientation="horizontal" className="mx-6 scrollbar-hide" style={{ width: 'calc(100vw - 24rem)' }}>
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
  )
}
