import { fetchRegionDetail, fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas"
import { RegionDetailType, RegionNameType } from "@/app/lib/types/mapTypes";
import {ScrollShadow} from "@nextui-org/react";

export default async function RegionDetail({ query}: {query: string}) {
  console.log('query', query);
  const regionNameData: RegionNameType[] = await fetchRegionName(query);
  const regionName = regionNameData[0].name;

  const regionDetailData: RegionDetailType[] = await fetchRegionDetail(regionName, 'history');

  return (
    <div>
      <h1>{regionNameData[0].name}</h1>
      <ScrollShadow hideScrollBar className="w-[300px] h-[400px]">
        <p>{regionDetailData[0].description}</p>
      </ScrollShadow>
    </div>
  )
}