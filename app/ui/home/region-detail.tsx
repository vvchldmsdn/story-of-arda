import { fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas"
import { ScrollShadow, Divider } from "@nextui-org/react";
import { notoSansKr } from "@/app/lib/fonts";
import Modals from "../atoms/modal";
import DetailLinkArrow from "../atoms/DetailLinkArrow";
import { convertString } from "@/app/lib/utils";
import NameBox from "../molcules/name-box";

export default async function RegionDetail({ query }: { query: string }) {
  const regionData = await fetchRegionName(query);
  const regionName = regionData.name;
  const regionBriefDescription = regionData.brief_description;
  const regionEnName = regionData.en_name;

  const convertedRegionEnName = convertString(regionEnName);

  const style: React.CSSProperties = {
    background: `radial-gradient(circle at 100% 100%, #222831 0, #222831 17px, transparent 17px) 0% 0%/20px 20px no-repeat,
            radial-gradient(circle at 0 100%, #222831 0, #222831 17px, transparent 17px) 100% 0%/20px 20px no-repeat,
            radial-gradient(circle at 100% 0, #222831 0, #222831 17px, transparent 17px) 0% 100%/20px 20px no-repeat,
            radial-gradient(circle at 0 0, #222831 0, #222831 17px, transparent 17px) 100% 100%/20px 20px no-repeat,
            linear-gradient(#222831, #222831) 50% 50%/calc(100% - 6px) calc(100% - 40px) no-repeat,
            linear-gradient(#222831, #222831) 50% 50%/calc(100% - 40px) calc(100% - 6px) no-repeat,
            linear-gradient(300deg, #febf4b 0%, #00adb5 100%)`,
    borderRadius: `20px`,
    padding: `13px`,
    boxSizing: `border-box`,
  };

  return (
    <div className="gap-2 h-full flex flex-col">
      <div className="bg-backblack text-eeeeee text-center h-56 flex justify-center items-center relative" style={style}>
        <NameBox 
          regionName={regionName}
          convertedRegionEnName={convertedRegionEnName}
          regionBriefDescription={regionBriefDescription}
        ></NameBox>
      </div>
      {/*       
      <div className="bg-backblack text-eeeeee text-center h-56 flex justify-center items-center relative" style={style}>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl">{regionName}</h1>
          <Divider orientation="horizontal" className="bg-ardayellow" />
          <p className="text-xl">{convertedRegionEnName}</p>
        </div>
        <Modals regionName={regionName} regionDescription={regionBriefDescription}></Modals>
      </div> */}
      <div className="bg-ardagrey flex-1 text-eeeeee rounded-3xl p-4 overflow-hidden">
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="h-16 flex-none text-2xl flex items-center text-ardamint">Brief Description</h1>
            <DetailLinkArrow subject={regionEnName}></DetailLinkArrow>
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