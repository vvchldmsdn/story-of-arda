import { fetchContentImages } from "@/app/lib/data-fetch/fetchDetailDatas";
import { ScrollShadow, Image } from "@nextui-org/react";

export default async function ContentImages({ subject }: { subject: string }) {
  const images = await fetchContentImages(subject);
  console.log(images);

  const size = 10;
  const tmp = Array.from({ length: size }, (v, i) => ({ key: i + 1 }));

  return (
    <ScrollShadow orientation="horizontal" hideScrollBar className="mx-6 flex-none h-48" style={{ width: 'calc(100vw - 24rem)' }}>
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
