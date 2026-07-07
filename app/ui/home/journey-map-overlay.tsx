'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { ArdaJourney } from "@/app/lib/arda-experience";

type Position = {
  x: number;
  y: number;
};

type ImageMetrics = {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
};

type JourneyMapOverlayProps = {
  journeys: ArdaJourney[];
  map: string;
  mapPosition: Position;
  scale: number;
  imageMetrics: ImageMetrics;
};

type Coord = [number, number];

const detailedTrailCoords: Record<string, Record<string, Coord[]>> = {
  "fellowship-road": {
    "Middle Earth": [
      [1848.8328, 746.6704],
      [1818, 807],
      [1796, 866],
      [1858, 928],
      [1936.3607, 897.4971],
      [1970, 1026],
      [1987.927, 1189.6115],
      [2052, 1246],
      [2149.9587, 1286.9312],
      [2244, 1414],
      [2320, 1628],
      [2450.0072, 1962.575],
      [2612, 1900],
      [2818, 1986],
      [3083.7443, 2053.4878],
    ],
  },
  "rohan-gondor-war": {
    "Middle Earth": [
      [1688.3238, 1520.817],
      [1732, 1606],
      [1785.9546, 1690.0562],
      [1878.2828, 1732.935],
      [1984, 1772],
      [2132, 1816],
      [2318, 1900],
      [2450.0072, 1962.575],
      [2538, 1858],
      [2601.5, 1712.5789],
    ],
  },
  "erebor-road": {
    "Middle Earth": [
      [1848.8328, 746.6704],
      [1882, 804],
      [1936.3607, 897.4971],
      [2078, 848],
      [2268, 820],
      [2468, 898],
      [2601.291, 952.8692],
      [2626, 760],
      [2550.238, 473.4328],
    ],
  },
};

function getTrailCoords(journey: ArdaJourney, map: string): Coord[] {
  const detailedCoords = detailedTrailCoords[journey.slug]?.[map];

  if (detailedCoords && detailedCoords.length > 0) {
    return detailedCoords;
  }

  return journey.steps.filter((step) => step.map === map).map((step) => step.coords);
}

function toScreenPoint(coord: Coord, imageMetrics: ImageMetrics) {
  return {
    x: (coord[0] / imageMetrics.naturalWidth) * imageMetrics.width,
    y: (coord[1] / imageMetrics.naturalHeight) * imageMetrics.height,
  };
}

function createRoutePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    const controlY = (previous.y + point.y) / 2 - Math.min(18, Math.max(-18, (point.x - previous.x) * 0.08));

    return `${path} Q ${controlX} ${controlY} ${point.x} ${point.y}`;
  }, "");
}

export default function JourneyMapOverlay({
  journeys,
  map,
  mapPosition,
  scale,
  imageMetrics,
}: JourneyMapOverlayProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const selectedJourneySlug = searchParams.get("journey");
  const selectedStepParam = Number(searchParams.get("step") || "0");
  const selectedJourney =
    journeys.find((journey) => journey.slug === selectedJourneySlug) || journeys[0];

  if (!selectedJourney || imageMetrics.width === 0 || imageMetrics.height === 0) {
    return null;
  }

  const selectedStepIndex =
    Number.isInteger(selectedStepParam) &&
    selectedStepParam >= 0 &&
    selectedStepParam < selectedJourney.steps.length
      ? selectedStepParam
      : 0;
  const trailPoints = getTrailCoords(selectedJourney, map).map((coord) => toScreenPoint(coord, imageMetrics));
  const routePath = createRoutePath(trailPoints);
  const intermediateTrailPoints = trailPoints.slice(1, -1);

  const moveToStep = (stepIndex: number) => {
    const step = selectedJourney.steps[stepIndex];
    const params = new URLSearchParams(searchParams);
    params.set("journey", selectedJourney.slug);
    params.set("step", String(stepIndex));
    params.set("map", step.map);
    params.set("query", `${step.coords[0]} ${step.coords[1]}`);
    params.delete("memory");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="pointer-events-none absolute z-10 hidden origin-center md:block"
      style={{
        left: mapPosition.x,
        top: mapPosition.y,
        width: imageMetrics.width,
        height: imageMetrics.height,
        transform: `scale(${scale})`,
      }}
      aria-hidden={false}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <path
          d={routePath}
          fill="none"
          stroke="#0B0F0D"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.75"
          strokeWidth="7"
        />
        <path
          d={routePath}
          fill="none"
          stroke="#F3C64B"
          strokeDasharray="5 9"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.92"
          strokeWidth="3"
        />
        <path
          d={routePath}
          fill="none"
          stroke="#F7F1DC"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {intermediateTrailPoints.map((point, index) => (
          <g key={`${selectedJourney.slug}-trail-${index}`}>
            <circle
              cx={point.x}
              cy={point.y}
              fill="#0B0F0D"
              r={index % 3 === 0 ? "4" : "2.7"}
              stroke="#F3C64B"
              strokeOpacity="0.9"
              strokeWidth="1.4"
            />
            <circle
              cx={point.x}
              cy={point.y}
              fill="#F7F1DC"
              opacity="0.78"
              r="1"
            />
          </g>
        ))}
      </svg>

      <div className="absolute left-0 top-0 h-full w-full">
        {selectedJourney.steps.map((step, index) => {
          if (step.map !== map) {
            return null;
          }

          const left = (step.coords[0] / imageMetrics.naturalWidth) * imageMetrics.width;
          const top = (step.coords[1] / imageMetrics.naturalHeight) * imageMetrics.height;
          const isActive = selectedStepIndex === index;

          return (
            <button
              type="button"
              className="group pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
              style={{ left, top }}
              key={`${selectedJourney.slug}-${step.label}-${index}`}
              onClick={(event) => {
                event.stopPropagation();
                moveToStep(index);
              }}
              aria-label={`Move to ${step.label}`}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold shadow-lg shadow-black/40 transition",
                  isActive
                    ? "border-[#D6A526] bg-[#D6A526] text-[#101214] ring-4 ring-[#D6A526]/28"
                    : "border-[#F5F0DF]/80 bg-[#101214]/84 text-[#F5F0DF] hover:border-[#D6A526] hover:text-[#D6A526]",
                )}
              >
                {index + 1}
              </span>
              <span
                className={clsx(
                  "max-w-[10rem] rounded-md border px-2 py-1 text-left text-[11px] leading-4 shadow-lg shadow-black/35 backdrop-blur-md transition",
                  isActive
                    ? "border-[#D6A526]/70 bg-[#101214]/92 text-[#F5F0DF]"
                    : "border-[#F5F0DF]/15 bg-[#101214]/70 text-[#F5F0DF]/70 opacity-0 group-hover:opacity-100",
                )}
              >
                {step.koLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
