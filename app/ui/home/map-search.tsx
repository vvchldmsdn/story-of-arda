'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "@/app/lib/hooks/useMap";
import { MapType } from "@/app/lib/types/mapTypes";
import type { ArdaJourney, PlaceMemoryEvent } from "@/app/lib/arda-experience";
import JourneyMapOverlay from "./journey-map-overlay";
import MapMemoryOverlay from "./map-memory-overlay";

type ImageMetrics = {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

export default function MapSearch({
  map,
  journeys,
  memories,
}: {
  map: string;
  journeys: ArdaJourney[];
  memories: PlaceMemoryEvent[];
}) {
  const mapSrc = map || 'Middle Earth';

  const divRef = useRef<HTMLDivElement>(null);
  const [mapData, setMapData] = useState<MapType>({ width: 0, height: 0, top: 0, left: 0 });
  const [imageMetrics, setImageMetrics] = useState<ImageMetrics>({
    width: 0,
    height: 0,
    naturalWidth: 1,
    naturalHeight: 1,
  });

  const {
    imgRef,
    mapPosition,
    scale,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    getRegionByClick,
  } = useMap(mapData);

  const updateImageMetrics = useCallback(() => {
    if (!imgRef.current) {
      return;
    }

    setImageMetrics({
      width: imgRef.current.clientWidth,
      height: imgRef.current.clientHeight,
      naturalWidth: imgRef.current.naturalWidth || 1,
      naturalHeight: imgRef.current.naturalHeight || 1,
    });
  }, [imgRef]);

  // 브라우저 리사이징 이벤트 리스너 삽입 및 제거 로직 
  useEffect(() => {
    const handleResize = () => {
      if (divRef.current && imgRef.current) {
        const rect = divRef.current.getBoundingClientRect();
        setMapData({ width: rect.width, height: rect.height, top: rect.top, left: rect.left });
        updateImageMetrics();
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // initial position

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [imgRef, updateImageMetrics]);

  useEffect(() => {
    const image = imgRef.current;
    const container = divRef.current;

    if (!image || !container) {
      return;
    }

    const syncMetrics = () => {
      const rect = container.getBoundingClientRect();
      setMapData({ width: rect.width, height: rect.height, top: rect.top, left: rect.left });
      updateImageMetrics();
    };

    syncMetrics();
    const frameId = window.requestAnimationFrame(syncMetrics);

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(syncMetrics);
      observer.observe(container);
      observer.observe(image);

      return () => {
        window.cancelAnimationFrame(frameId);
        observer.disconnect();
      };
    }

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [imgRef, mapSrc, updateImageMetrics]);

  return (
    <div
      ref={divRef}
      className='relative h-full overflow-hidden'
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={`/${mapSrc}.jpg`}
        alt="Home Map Image"
        onClick={(e) => getRegionByClick(e.clientX, e.clientY)}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ left: mapPosition.x, top: mapPosition.y, transform: `scale(${scale})` }}
        className="absolute w-full h-auto object-cover origin-center"
        onLoad={updateImageMetrics}
        onWheel={handleZoomIn}
      ></img>
      <JourneyMapOverlay
        journeys={journeys}
        map={mapSrc}
        mapPosition={mapPosition}
        scale={scale}
        imageMetrics={imageMetrics}
      />
      <MapMemoryOverlay
        memories={memories}
        map={mapSrc}
        mapPosition={mapPosition}
        scale={scale}
        imageMetrics={imageMetrics}
      />
    </div>
  )
}

