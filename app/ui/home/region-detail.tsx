import { fetchRegionDetail, fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas"
import { RegionDetailType, RegionNameType } from "@/app/lib/types/mapTypes";
import {ScrollShadow} from "@nextui-org/react";
import ButtonWrapper from "./region-detail-buttons";
import { firaSans } from "@/app/lib/fonts";

export default async function RegionDetail({ query, detail }: {query: string, detail: string}) {
  const regionNameData: RegionNameType[] = query === '' ? [{name: ''}] : await fetchRegionName(query);
  const regionName = regionNameData[0].name;
  const regionDetailData: RegionDetailType[] = detail === '' ? [{description: ''}] : await fetchRegionDetail(regionName, detail);

  return (
    <div className="flex flex-col h-full pb-4 xl:px-16">
      <h1 className="w-full h-40 flex flex-none justify-center items-center text-6xl text-eeeeee">{regionNameData[0].name}</h1>
      <div className="w-full h-20 flex-none">
        <ButtonWrapper></ButtonWrapper>
      </div>
      <div className="p-4 flex-auto overflow-hidden">
        <ScrollShadow hideScrollBar className="w-full h-full">
          <p className={`text-eeeeee whitespace-pre-line text-center ${firaSans.className}`}>{regionDetailData[0].description}</p>
        </ScrollShadow>
      </div>
    </div>
  )
}