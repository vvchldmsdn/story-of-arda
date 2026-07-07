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
        <polyline
          points={selectedJourney.steps
            .filter((step) => step.map === map)
            .map((step) => {
              const x = (step.coords[0] / imageMetrics.naturalWidth) * imageMetrics.width;
              const y = (step.coords[1] / imageMetrics.naturalHeight) * imageMetrics.height;
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#D6A526"
          strokeDasharray="8 10"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.68"
          strokeWidth="3"
        />
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
