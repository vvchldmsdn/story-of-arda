'use client'

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { sortedRegions } from '../../lib/regionNames'

export default function Search() {
  const tmp = [
    {value: 'a'},
    {value: 'b'},
    {value: 'c'},
    {value: 'd'},
    {value: '1'},
    {value: '2'},
    {value: '3'},
    {value: '4'},
    {value: '5'},
    {value: '6'},
    {value: '7'},
    {value: '8'},
    {value: '9'},
    {value: '10'},
    {value: '11'},
    {value: '12'},
    {value: '13'},
    {value: '14'},
    {value: '15'},
    {value: '16'},
    {value: '17'},
    {value: '18'},
    {value: '19'},
  ];
  return (
    <div className="absolute bottom-0 right-0 w-64">
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Autocomplete
        classNames={{
          base: "max-w-xs",
          listboxWrapper: "max-h-[160px]",
          selectorButton: "text-ardayellow"  // 화살표 버튼 색
        }}
        scrollShadowProps={{
          isEnabled: false
        }}
        inputProps={{
          classNames: {
            input: "ml-1",
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
            <AutocompleteItem key={region.value} value={region.value}>
              {region.value}
            </AutocompleteItem>
          )
        })}
      </Autocomplete>
    </div>
    </div>
    
  )
}