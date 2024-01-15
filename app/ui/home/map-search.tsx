'use client'

import { useEffect, useRef, useState } from "react";
import { useMap } from "@/app/lib/hooks/useMap";
import { MapType } from "@/app/lib/types/mapTypes";

export default function MapSearch() {
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

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  const onClick = () => {
    const imgRect = imgRef.current?.getBoundingClientRect();
    console.log('on click');
    console.log(imgRect);
  }

  const {
    imgRef,
    mapPosition,
    scale,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn
  } = useMap(mapData);

  return (
    <div
      ref={divRef}
      className='h-full relative'
    >
      <img
        ref={imgRef}
        src="/SoA.jpeg"
        alt="Home Map Image"
        onClick={onClick}
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