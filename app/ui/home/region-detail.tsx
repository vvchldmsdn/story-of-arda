import { fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas"
import { RegionDetailType, RegionNameType } from "@/app/lib/types/mapTypes";
import {ScrollShadow} from "@nextui-org/react";
import { firaSans } from "@/app/lib/fonts";
import Modals from "./modal";
import Image from "next/image";

export default async function RegionDetail({ query }: {query: string}) {
  const regionData: RegionNameType = await fetchRegionName(query);
  const regionName = regionData.name;
  const regionBriefDescription = regionData.brief_description;
  

  const style: React.CSSProperties = {
    background: `radial-gradient(circle at 100% 100%, #222831 0, #222831 19px, transparent 19px) 0% 0%/24px 24px no-repeat,
            radial-gradient(circle at 0 100%, #222831 0, #222831 19px, transparent 19px) 100% 0%/24px 24px no-repeat,
            radial-gradient(circle at 100% 0, #222831 0, #222831 19px, transparent 19px) 0% 100%/24px 24px no-repeat,
            radial-gradient(circle at 0 0, #222831 0, #222831 19px, transparent 19px) 100% 100%/24px 24px no-repeat,
            linear-gradient(#222831, #222831) 50% 50%/calc(100% - 10px) calc(100% - 48px) no-repeat,
            linear-gradient(#222831, #222831) 50% 50%/calc(100% - 48px) calc(100% - 10px) no-repeat,
            linear-gradient(135deg, #00adb5 18%, #FEBF4B 79%)`,
    borderRadius: '24px',
    padding: '9px',
    boxSizing: 'border-box',
  };

  return (
    <div className="gap-2 h-full flex flex-col">
      <div className="bg-backblack text-eeeeee text-5xl text-center h-56 flex justify-center items-center relative" style={style}>
        {regionName}
        <Modals regionName={regionName} regionDescription={regionBriefDescription}></Modals>
      </div>
      <div className="bg-ardagrey flex-1 text-eeeeee rounded-3xl p-4 overflow-hidden">
        <div className="w-full h-full flex flex-col">
          <h1 className="h-16 flex-none text-3xl flex items-center text-ardamint mb-8">Brief Description</h1>
          <div className="flex-1 overflow-hidden text-lg">
            <ScrollShadow hideScrollBar className="w-full h-full" size={100}>
              <p className={`text-justify text-lg ${firaSans.className}`}>{regionBriefDescription}</p>
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  )
};