'use client'

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {Divider} from "@nextui-org/react";
import clsx from "clsx";

export default function ButtonWrapper() {
  const detailTypes = [
    {key: 1, type: 'history'},
    {key: 2, type: 'geography'},
    {key: 3, type: 'role_in_story'},
    {key: 4, type: 'depiction_in_media'},
  ];

  return (
    <div className="flex flex-row flex-wrap space-x-2 justify-center items-center h-full">
      {detailTypes.map((item) => {
        return (
          <div className="flex flex-row items-center space-x-2" key={item.key}>
            <Buttons type={item.type}></Buttons>
            <Divider orientation="vertical" />
          </div>
        )
      })}
    </div>
  )
};

export function Buttons({type}: {type: string}) {
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = new URLSearchParams(mapCoordParams);
  const detailType = params.get('detail');

  const handleButtonClick = () => {
    params.set('detail', type);
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div
      onClick={handleButtonClick}
      className={clsx(
        'text-xs',
        {
          'text-ardamint': detailType === type,
        },
        {
          'text-eeeeee': detailType !== type,
        }
      )}
    >
      {type}
    </div>
  )
};