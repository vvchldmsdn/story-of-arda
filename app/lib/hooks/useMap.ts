import { useState, useRef, useCallback, useEffect } from "react";
import { MapType } from "../types/mapTypes";

type PositionType = { x: number, y: number };

// Position 상태를 통합적으로 관리하는 커스텀 훅
const usePosition = (initialPosition: PositionType) => {
  const [position, setPosition] = useState<PositionType>(initialPosition);

  const updatePosition = useCallback((newPosition: PositionType) => {
    setPosition(newPosition);
  }, []);

  return [position, updatePosition] as const;
};


export const useMap = (mapData: MapType) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [dragging, setDragging] = useState<boolean>(false); 
  const [mapPosition, setMapPosition] = usePosition({ x: 0, y: 0 });
  const [mouseStart, setMouseStart] = usePosition({ x: 0, y: 0 });
  const [mapTopLeft, setMapTopLeft] = usePosition({ x: 0, y: 0 });
  // 클릭과 드래그 구분용 state
  const [isMoved, setIsMoved] = useState<boolean>(false);

  // 중복되는 로직을 처리하는 함수
  const calculateNewPosition = useCallback((clientX: number, clientY: number, rect: ClientRect) => {
    let newX: number;
    let newY: number;

    if (mapPosition.x + (clientX - rect.left - mouseStart.x) > mapTopLeft.x) {
      newX = mapTopLeft.x;
    } else if (mapPosition.x + (clientX - rect.left - mouseStart.x) < mapTopLeft.x - (rect.width - mapData.width)) {
      newX = mapTopLeft.x - (rect.width - mapData.width);
    } else {
      newX = mapPosition.x + (clientX - rect.left - mouseStart.x);
    }

    if (mapPosition.y + (clientY - rect.top - mouseStart.y) > mapTopLeft.y) {
      newY = mapTopLeft.y;
    } else if (mapPosition.y + (clientY - rect.top - mouseStart.y) < mapTopLeft.y - (rect.height - mapData.height)) {
      newY = mapTopLeft.y - (rect.height - mapData.height)
    } else {
      newY = mapPosition.y + (clientY - rect.top - mouseStart.y);
    }

    return { x: newX, y: newY };
  }, [mapPosition, mouseStart, mapTopLeft, mapData]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.preventDefault();
    setDragging(true);
    setIsMoved(false);
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect(); 
      setMouseStart({ x: e.clientX - rect.left, y: e.clientY - rect.top }); 
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    setIsMoved(true);
    if (dragging && imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      const newPosition = calculateNewPosition(e.clientX, e.clientY, rect);
      setMapPosition(newPosition);
    }
  }, [dragging, calculateNewPosition]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleZoomIn = useCallback((e: React.WheelEvent<HTMLImageElement>) => {
    if (imgRef.current) {
      if (e.deltaY < 0 && scale < 5) {
        const newScale: number = scale + 0.5;
        const rect = imgRef.current.getBoundingClientRect();
        const imageCenter: Array<number> = [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
        const [newRectLeft, newRectTop] = [
          imageCenter[0] - (imageCenter[0] - rect.left) * (newScale / scale)
          , imageCenter[1] - (imageCenter[1] - rect.top) * (newScale / scale)]
        setMapTopLeft({ x: mapPosition.x + mapData.left - newRectLeft, y: mapPosition.y + mapData.top - newRectTop });
        setScale(prev => prev + 0.5);
      } else if (e.deltaY > 0 && scale > 1) {
        const newScale = scale - 0.5;
        const ratio = newScale / scale;
        const rect = imgRef.current.getBoundingClientRect();
        const imageCenter: Array<number> = [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
        const newRect = {
          left: imageCenter[0] - (imageCenter[0] - rect.left) * ratio,
          top: imageCenter[1] - (imageCenter[1] - rect.top) * ratio,
          right: (rect.right - imageCenter[0]) * ratio + imageCenter[0],
          bottom: (rect.bottom - imageCenter[1]) * ratio + imageCenter[1]
        };

        let newX = mapPosition.x;
        let newY = mapPosition.y;

        if (newRect.top > mapData.top) {
          newY += mapData.top - newRect.top;
        } else if (newRect.bottom < mapData.top + mapData.height) {
          newY += mapData.top + mapData.height - newRect.bottom;
        }

        if (newRect.left > mapData.left) {
          newX += mapData.left - newRect.left;
        } else if (newRect.right < mapData.left + mapData.width) {
          newX += + mapData.left + mapData.width - newRect.right;
        };

        setMapTopLeft({ x: mapPosition.x - newRect.left + mapData.left, y: mapPosition.y + mapData.top - newRect.top });
        setMapPosition({ x: newX, y: newY });
        setScale(newScale);
      }
    }
  }, [scale, imgRef, mapPosition, mapData]);

  useEffect(() => {
    if (imgRef.current) {
      const ratio = 1
      const rect = imgRef.current.getBoundingClientRect();
      const imageCenter: Array<number> = [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2];
      const newRect = {
        left: imageCenter[0] - (imageCenter[0] - rect.left) * ratio,
        top: imageCenter[1] - (imageCenter[1] - rect.top) * ratio,
        right: (rect.right - imageCenter[0]) * ratio + imageCenter[0],
        bottom: (rect.bottom - imageCenter[1]) * ratio + imageCenter[1]
      };

      let newX = mapPosition.x;
      let newY = mapPosition.y;

      if (newRect.top > mapData.top) {
        newY += mapData.top - newRect.top;
      } else if (newRect.bottom < mapData.top + mapData.height) {
        newY += mapData.top + mapData.height - newRect.bottom;
      }

      if (newRect.left > mapData.left) {
        newX += mapData.left - newRect.left;
      } else if (newRect.right < mapData.left + mapData.width) {
        newX += + mapData.left + mapData.width - newRect.right;
      };

      setMapTopLeft({ x: mapPosition.x - newRect.left + mapData.left, y: mapPosition.y + mapData.top - newRect.top });
      setMapPosition({ x: newX, y: newY });
    }
  }, [mapData]);

  return {
    imgRef,
    scale,
    setScale,
    dragging,
    setDragging,
    mapPosition,
    setMapPosition,
    mouseStart,
    setMouseStart,
    mapTopLeft,
    setMapTopLeft,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    isMoved,
    // handleZoomOut
  }
}