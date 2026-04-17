'use client'

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { sortedRegions } from '../../lib/regionNames';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { Key } from "react";

export default function Search() {
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const setQuery = (coords: Array<number>) => {
    const params = new URLSearchParams(mapCoordParams);
    params.set('query', `${coords[0]} ${coords[1]}`);
    replace(`${pathname}?${params.toString()}`)
  };

  const handleSelectionChange = (key: Key | null) => {
    if (!key) {
      return;
    }

    const region = sortedRegions.find((item: any) => item.value === String(key));

    if (region) {
      setQuery(region.coords);
    }
  };

  return (
    <div className="w-full text-[#F5F7EF]">
      <Autocomplete
        classNames={{
          base: "w-full max-w-none",
          listboxWrapper: "max-h-[160px]",
          selectorButton: "text-[#D6A526] text-2xl"
        }}
        onSelectionChange={handleSelectionChange}
        scrollShadowProps={{
          isEnabled: false
        }}
        inputProps={{
          classNames: {
            input: `ml-1`,
            inputWrapper: "h-[52px] border border-[#D6A526]/35 bg-[#101214]/90 text-[#F5F7EF] shadow-xl shadow-black/30 backdrop-blur-md",
          },
        }}
        listboxProps={{
          hideSelectedIcon: false,
          itemClasses: {
            base: [
              "rounded-medium",
              "text-[#F5F7EF]",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[pressed=true]:opacity-70",
              "data-[hover=true]:bg-[#D6A526]",
              "data-[selectable=true]:focus:bg-default-100",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        aria-label="지역 검색"
        placeholder="지역 이름으로 이동"
        popoverProps={{
          offset: 10,
          classNames: {
            base: "rounded-md",
            content: "rounded-md border border-[#D6A526]/35 bg-[#101214] p-1",
          },
        }}
        radius="md"
        variant="bordered"
      >
        {sortedRegions.map((region: any) => {
          return (
            <AutocompleteItem key={region.value} value={region.value}>
              {region.value}
            </AutocompleteItem>
          )
        })}
      </Autocomplete>
    </div>
  )
}
