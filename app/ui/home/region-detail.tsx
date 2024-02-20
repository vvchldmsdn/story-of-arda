import { fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas"
import {ScrollShadow, Divider, Button} from "@nextui-org/react";
import Link from "next/link";
import { RightArrow } from "@/app/lib/icons";
import { firaSans, notoSansKr } from "@/app/lib/fonts";
import Modals from "./modal";

export default async function RegionDetail({ query }: {query: string}) {
  const regionData = await fetchRegionName(query);
  const regionName = regionData.name;
  const regionBriefDescription = regionData.brief_description;
  const regionEnName = regionData.en_name;
  
  function convertString(str: string) {
    return str.split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
  };

  const convertedRegionEnName = convertString(regionEnName)

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
      <div className="bg-backblack text-eeeeee text-center h-56 flex justify-center items-center relative" style={style}>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl">{regionName}</h1>
          <Divider orientation="horizontal" className="bg-ardayellow" />
          <p className="text-xl">{convertedRegionEnName}</p>
        </div>
        <Modals regionName={regionName} regionDescription={regionBriefDescription}></Modals>
      </div>
      <div className="bg-ardagrey flex-1 text-eeeeee rounded-3xl p-4 overflow-hidden">
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="h-16 flex-none text-2xl flex items-center text-ardamint">Brief Description</h1>
            <Button className="ml-2" href="/target-page" variant="light">
              <Link href={`/detail/${regionEnName}`}><RightArrow /></Link>
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ScrollShadow hideScrollBar className="w-full h-full" size={100}>
              <p className={`text-justify text-base ${notoSansKr.className}`}>{regionBriefDescription}</p>
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  )
};