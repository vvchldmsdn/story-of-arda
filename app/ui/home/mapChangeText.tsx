'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Tabs, Tab } from '@nextui-org/react';
import { useState, useEffect } from 'react';

export default function MapChange({ map }: { map: string }) {
  const mapIdParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [selected, setSelected] = useState<string>('Middle Earth');

  const maps = [
    { name: 'Middle Earth', id: 4 },
    { name: 'Beleriand', id: 3 },
    { name: 'Numenor', id: 5 }
  ];

  useEffect(() => {
    const params = new URLSearchParams(mapIdParams);
    params.set('map', selected);
    replace(`${pathname}?${params.toString()}`);
  }, [selected]);

  const handleSelectionChange = (key: string | number) => {
    setSelected(String(key));
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