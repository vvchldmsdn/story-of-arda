import { Divider } from "@nextui-org/react";
import Modals from "../atoms/modal";

export default function NameBox({
  regionName,
  convertedRegionEnName,
  regionBriefDescription,
}: {
  regionName: string,
  convertedRegionEnName: string,
  regionBriefDescription: string
}) {
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
    <>
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl">{regionName}</h1>
        <Divider orientation="horizontal" className="bg-ardayellow" />
        <p className="text-xl">{convertedRegionEnName}</p>
      </div>
      <Modals regionName={regionName} regionDescription={regionBriefDescription}></Modals>
    </>
  )
}