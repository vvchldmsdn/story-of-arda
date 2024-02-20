'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "@/app/lib/hooks/useMap";
import { MapType } from "@/app/lib/types/mapTypes";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';


export default function MapSearch({ map }: { map: string}) {
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  // const [mapUrl, setMapUrl] = useState<string>('https://7n4o607yk61qs6d9.public.blob.vercel-storage.com/Middle%20Earth-fN9BbkSngmUHyQxXiLeCaBC44TGvcL.jpg');

  let mapUrl;
  switch (map) {
    case 'Middle Earth':
      mapUrl = '/Middle Earth.jpg';
      break;
    case 'Beleriand':
      mapUrl = '/Beleriand.jpg';
      break;
    case 'Numenor':
      mapUrl = '/Numenor.jpg';
      break;
  }

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

    // query=1694.8769+1184.4651&detail=history
    const params = new URLSearchParams(mapCoordParams);
    params.set('query', `1694.8769 1184.4651`);
    params.set('map', 'Middle Earth');
    replace(`${pathname}?${params.toString()}`)

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
    isMoved
  } = useMap(mapData);

  const getRegionByClick = useCallback((e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (imgRef.current && !isMoved) {
      const rect = imgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (imgRef.current.naturalWidth / rect.width);
      const y = (e.clientY - rect.top) * (imgRef.current.naturalHeight / rect.height);
      console.log(`[${Math.round(x * 1e4) / 1e4}, ${Math.round(y * 1e4) / 1e4}]`);
      const params = new URLSearchParams(mapCoordParams);
      params.set('query', `${Math.round(x * 1e4) / 1e4} ${Math.round(y * 1e4) / 1e4}`);
      replace(`${pathname}?${params.toString()}`)
    }
  }, [imgRef, isMoved]);

  return (
    <div
      ref={divRef}
      className='h-full relative'
    >
      <img
        ref={imgRef}
        src={mapUrl}
        alt="Home Map Image"
        onClick={getRegionByClick}
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