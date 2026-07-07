'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Tabs, Tab } from '@nextui-org/react';
import { ardaEraMaps } from '@/app/lib/arda-experience';

export default function MapChange({ map }: { map: string }) {
  const mapIdParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const selected = ardaEraMaps.some((item) => item.map === map) ? map : 'Middle Earth';

  const handleSelectionChange = (key: string | number) => {
    const selectedMap = String(key);
    const params = new URLSearchParams(mapIdParams);
    params.set('map', selectedMap);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-auto">
      <Tabs
        variant='bordered'
        color='warning'
        size='md'
        radius="sm"
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
        classNames={{
          tabList: "w-full border border-[#D6A526]/35 bg-[#101214]/90 p-1 shadow-xl shadow-black/30 backdrop-blur-md md:w-auto",
          cursor: "bg-[#D6A526]",
          tab: "h-12 px-3",
          tabContent: "text-[#F5F7EF] group-data-[selected=true]:text-[#101214]"
        }}
      >
        {ardaEraMaps.map((item) => {
            return (
              <Tab
                className='text-sm'
                key={item.map}
                title={
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-xs">{item.era}</span>
                    <span className="text-[11px] opacity-75">{item.map}</span>
                  </span>
                }
              />
            )
          })}
      </Tabs>
    </div>
  )
}
