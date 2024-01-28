'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import clsx from "clsx";

export default function MapChange({ map }: { map: string }) {
  const mapIdParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const maps = [
    { name: 'Middle Earth', id: 4 },
    { name: 'Beleriand', id: 3 },
    { name: 'Numenor', id: 5 }
  ];

  const handleMapTypeClick = (map: string) => {
    const params = new URLSearchParams(mapIdParams);
    params.set('map', map);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      {maps.map((item) => {
          return (
            <div
              key={item.id}
              className={clsx(
                "mt-16 text-4xl hover:cursor-pointer",
                {
                  "text-eeeeee": map !== item.name
                },
                {
                  "text-ardayellow": map === item.name
                }
              )}
              onClick={() => handleMapTypeClick(item.name)}
            >{item.name}</div>
          )
        })}
    </div>
  )
}