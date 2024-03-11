'use client'

import { useEffect, useRef, useState } from "react";
import { useMap } from "@/app/lib/hooks/useMap";
import { MapType } from "@/app/lib/types/mapTypes";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';


export default function MapSearch({ map, query }: { map: string, query: string}) {
  let mapSrc = map === null || map == undefined ? 'Middle Earth' : map;
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const divRef = useRef<HTMLImageElement>(null);
  const [mapData, setMapData] = useState<MapType>({ width: 0, height: 0, top: 0, left: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (divRef.current && imgRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        setMapData({ width: rect.width, height: rect.height, top: rect.top, left: rect.left });
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // initial position

    // query=1694.8769+1184.4651
    const params = new URLSearchParams(mapCoordParams);
    params.set('query', `2436.3901 1957.8402`);
    params.set('map', 'Middle Earth');
    replace(`${pathname}?${params.toString()}`)
    mapSrc = 'Middle Earth'

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  const {
    imgRef,
    mapPosition,
    scale,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    getRegionByClick,
    isMoved
  } = useMap(mapData);

  return (
    <div
      ref={divRef}
      className='h-full relative'
    >
      <img
        ref={imgRef}
        src={`/${mapSrc}.jpg`}
        alt="Home Map Image"
        // onClick={getRegionByClick}
        onClick={(e) => getRegionByClick(e.clientX, e.clientY, imgRef, isMoved)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ left: mapPosition.x, top: mapPosition.y, transform: `scale(${scale})` }}
        className="absolute w-full h-auto object-cover origin-center"
        onWheel={handleZoomIn}
      ></img>
    </div>
  )
}

