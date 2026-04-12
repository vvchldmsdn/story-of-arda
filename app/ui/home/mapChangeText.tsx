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
    <>
      <Tabs variant='light' color='warning' size='lg'
        selectedKey={selected}
        onSelectionChange={handleSelectionChange}
      >
        {maps.map((item) => {
            return (
              <Tab
                className='text-2xl h-20'
                key={item.name}
                title={item.name}
              />
            )
          })}
      </Tabs>
      
    </>
  )
}
