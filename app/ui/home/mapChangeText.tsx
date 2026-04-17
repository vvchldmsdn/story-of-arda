'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Tabs, Tab } from '@nextui-org/react';

export default function MapChange({ map }: { map: string }) {
  const mapIdParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const maps = [
    { name: 'Middle Earth' },
    { name: 'Beleriand' },
    { name: 'Numenor' }
  ];

  const selected = maps.some((item) => item.name === map) ? map : 'Middle Earth';

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
          tab: "h-10 px-3",
          tabContent: "text-[#F5F7EF] group-data-[selected=true]:text-[#101214]"
        }}
      >
        {maps.map((item) => {
            return (
              <Tab
                className='text-sm'
                key={item.name}
                title={item.name}
              />
            )
          })}
      </Tabs>
    </div>
  )
}
