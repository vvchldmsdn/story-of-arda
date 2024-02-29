'use client'

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { sortedRegions } from '../../lib/regionNames';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const handleListItemClick = (coords: Array<number>) => {
    console.log(coords);
    const params = new URLSearchParams(mapCoordParams);
    params.set('query', `${coords[0]} ${coords[1]}`);
    params.set('detail', 'history');
    replace(`${pathname}?${params.toString()}`)
  };

  return (
    <div className="absolute bottom-0 right-0 w-64 xl:relative xl:mx-auto">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Autocomplete
          classNames={{
            base: "max-w-xs",
            listboxWrapper: "max-h-[160px]",
            selectorButton: "text-ardayellow text-2xl"  // 화살표 버튼 색
          }}
          scrollShadowProps={{
            isEnabled: false
          }}
          inputProps={{
            classNames: {
              input: `ml-1`,
              inputWrapper: "h-[48px] bg-backblack text-eeeeee",
            },
          }}
          listboxProps={{
            hideSelectedIcon: false,
            itemClasses: {
              base: [
                "rounded-medium",
                "text-eeeeee",  // 목록 글자 색
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "data-[pressed=true]:opacity-70",
                "data-[hover=true]:bg-ardayellow",  // 목록 호버시 색
                "data-[selectable=true]:focus:bg-default-100",
                "data-[focus-visible=true]:ring-default-500",
              ],
            },
          }}
          aria-label="Select an employee"
          placeholder="Enter employee name"
          popoverProps={{
            offset: 10,
            classNames: {
              base: "rounded-large",
              content: "p-1 border-small border-default-100 bg-backblack",  // 목록 박스 테두리 색
            },
          }}
          radius="full"
          variant="bordered"
        >
          {sortedRegions.map((region: any) => {
            return (
              <AutocompleteItem key={region.value} value={region.value}
                onClick={() => handleListItemClick(region.coords)}
              >
                {region.value}
              </AutocompleteItem>
            )
          })}
        </Autocomplete>
      </div>
    </div>
  )
}