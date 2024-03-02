import {Card, CardFooter, Image, Button} from "@nextui-org/react";
import { CardSummaryType, RegionNameType, CardPropType } from "@/app/lib/types/mapTypes";
import { fetchCardCharacterSummary, fetchCardEventSummary, fetchRandomCharacterName, fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas";
import Link from "next/link";
import clsx from "clsx";

export default async function CardWrapper({ query }: {query: string}) {
  const regionData: RegionNameType = await fetchRegionName(query);
  const regionName = regionData.name;

  const totalCharacters = await fetchCardCharacterSummary(regionName);
  const totalEvents = await fetchCardEventSummary(regionName);
  const randomCharacterName = await fetchRandomCharacterName(regionName);

  return (
    <div className="flex flex-col gap-2">
      <Cards cardProps={{ type: 'character', num: totalCharacters, regionName: regionName, randomName: randomCharacterName }}></Cards>
      <Cards cardProps={{ type: 'event', num: totalEvents, regionName: regionName, randomName: '' }}></Cards>
    </div>
  )
};

export function Cards({ cardProps }: { cardProps: CardPropType }) {
  return (
    <>
      <Card
        isFooterBlurred
        radius="lg"
        className="border-none w--80 h-full flex justify-center items-center flex-1"
      >
        {/* 배경 색 & 정보 들어갈 부분 */}
        <div className={clsx(
          "flex flex-col h-full w-full p-8 pt-6",
          {
            "bg-ardamint": cardProps.type === 'character'
          },
          {
            "bg-ardayellow": cardProps.type === 'event'
          }
        )}>
          <p className="text-lg">total {cardProps.type}s in</p>
          <p className="text-lg">{cardProps.regionName}</p>
          <div className="flex flex-row justify-between items-center mt-4">
            <h1 className="text-7xl text-backblack">{cardProps.num}</h1>
            <p className="text-sm">including {cardProps.randomName}</p>
          </div>
        </div>
        {/* <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-backblack">Go See the Details</p>
          <Link href={'/home/details'}>
            <Button className="text-tiny text-backblack bg-black/20" variant="flat" color="default" radius="lg" size="sm">
              go
            </Button>
          </Link>
        </CardFooter> */}
      </Card>
    </>
  )
};