import { useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { MapType } from "@/app/lib/types/mapTypes";

type PositionType = { x: number, y: number };

export const useLocateCenter = (
  imgRef: React.RefObject<HTMLImageElement>, 
  isMoved: boolean,
  calculateNewPosition: any,
  mapData: MapType,
  mapPosition: PositionType,
  setMapPosition: (newPosition: PositionType) => void,
  setMouseStart: (newPosition: PositionType) => void,
) => {
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const getRegionByClick = useCallback((
    clientX: any,
    clientY: any,
    imgRef: React.RefObject<HTMLImageElement>,
    isMoved: boolean
  ) => {
    if (imgRef.current && !isMoved) {
      
      const rect = imgRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) * (imgRef.current.naturalWidth / rect.width);
      const y = (clientY - rect.top) * (imgRef.current.naturalHeight / rect.height);

      console.log(`[${Math.round(x * 1e4) / 1e4}, ${Math.round(y * 1e4) / 1e4}]`);

      const divCenter = { x: mapData.left + mapData.width / 2, y: mapData.top + mapData.height / 2}
      setMouseStart({ x: clientX - rect.left, y: clientY - rect.top });
      const unitDistance = 12;
      const diffX = Math.abs(divCenter.x - clientX);
      const diffY = Math.abs(divCenter.y - clientY);
      const unitDistanceX = diffX * unitDistance / Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      const unitDistanceY = diffY * unitDistance / Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      const xDirection = divCenter.x <= clientX ? -1 : 1;
      const yDirection = divCenter.y <= clientY ? -1 : 1;
      
      let currLoc = { x: clientX, y: clientY };
      
      const animate = () => {
        currLoc.x += xDirection * unitDistanceX;
        currLoc.y += yDirection * unitDistanceY;
      
        if ((currLoc.x - divCenter.x) * xDirection > 0 && (currLoc.y - divCenter.y) * yDirection > 0) {
          return;
        }
      
        const newPosition = calculateNewPosition(currLoc.x, currLoc.y, rect);
        setMapPosition(newPosition);
      
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);

      const params = new URLSearchParams(mapCoordParams);
      params.set('query', `${Math.round(x * 1e4) / 1e4} ${Math.round(y * 1e4) / 1e4}`);
      replace(`${pathname}?${params.toString()}`);
    }
  }, [imgRef, isMoved, calculateNewPosition, mapData]);

  return getRegionByClick;
}