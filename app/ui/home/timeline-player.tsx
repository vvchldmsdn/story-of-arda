'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { ArdaJourney } from "@/app/lib/arda-experience";

export default function TimelinePlayer({ journeys }: { journeys: ArdaJourney[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const journeySlug = searchParams.get("journey");
  const stepParam = Number(searchParams.get("step") || "0");

  const selectedJourney = useMemo(
    () => journeys.find((journey) => journey.slug === journeySlug) || journeys[0],
    [journeys, journeySlug],
  );

  const moveToStep = useCallback((journey: ArdaJourney, stepIndex: number) => {
    const nextStep = journey.steps[stepIndex];
    const params = new URLSearchParams(searchParams);
    params.set("journey", journey.slug);
    params.set("step", String(stepIndex));
    params.set("map", nextStep.map);
    params.set("query", `${nextStep.coords[0]} ${nextStep.coords[1]}`);
    params.delete("memory");
    replace(`${pathname}?${params.toString()}`);
  }, [pathname, replace, searchParams]);

  const activeStepIndex =
    selectedJourney && Number.isInteger(stepParam) && stepParam >= 0 && stepParam < selectedJourney.steps.length
      ? stepParam
      : 0;
  const activeStep = selectedJourney?.steps[activeStepIndex];
  const progress =
    !selectedJourney || selectedJourney.steps.length <= 1
      ? 100
      : (activeStepIndex / (selectedJourney.steps.length - 1)) * 100;

  const selectJourney = (journey: ArdaJourney) => {
    setIsPlaying(false);
    moveToStep(journey, 0);
  };

  useEffect(() => {
    if (!isPlaying || !selectedJourney) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextIndex =
        activeStepIndex + 1 >= selectedJourney.steps.length ? 0 : activeStepIndex + 1;
      moveToStep(selectedJourney, nextIndex);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [activeStepIndex, isPlaying, moveToStep, selectedJourney]);

  if (!selectedJourney || !activeStep) {
    return null;
  }

  return (
    <section className="rounded-xl border border-[#E7C86A]/40 bg-[#0B100E]/95 text-[#F7F1DC] shadow-[0_20px_70px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-xl">
      <div className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#E7C86A]">Chronicle</p>
            <span className="h-px flex-1 bg-[#F7F1DC]/18" />
            <p className="text-[11px] text-[#F7F1DC]/62">{activeStepIndex + 1}/{selectedJourney.steps.length}</p>
          </div>
          <h2 className="mt-2 truncate text-base font-semibold leading-6 text-[#FFF8DE]">{selectedJourney.title}</h2>
          <p className="truncate text-xs text-[#F7F1DC]/68">{activeStep.koLabel} - {activeStep.summary}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#F7F1DC]/25 text-[#F7F1DC]/78 transition hover:border-[#E7C86A] hover:text-[#E7C86A]"
            onClick={() => moveToStep(selectedJourney, Math.max(0, activeStepIndex - 1))}
            aria-label="이전 사건"
          >
            <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={clsx(
              "flex h-9 min-w-12 items-center justify-center rounded-md border px-3 transition",
              isPlaying
                ? "border-[#F7F1DC]/25 bg-[#F7F1DC]/12 text-[#F7F1DC]"
                : "border-[#E7C86A] bg-[#E7C86A] text-[#0B100E] hover:bg-[#F7F1DC]",
            )}
            onClick={() => setIsPlaying((current) => !current)}
            aria-label={isPlaying ? "일시정지" : "재생"}
          >
            {isPlaying ? <PauseIcon className="h-4 w-4" aria-hidden="true" /> : <PlayIcon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#F7F1DC]/25 text-[#F7F1DC]/78 transition hover:border-[#E7C86A] hover:text-[#E7C86A]"
            onClick={() => moveToStep(selectedJourney, Math.min(selectedJourney.steps.length - 1, activeStepIndex + 1))}
            aria-label="다음 사건"
          >
            <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="relative h-2 rounded-full bg-[#F7F1DC]/18">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#E7C86A]"
            style={{ width: `${progress}%` }}
          />
          {selectedJourney.steps.map((step, index) => (
            <button
              type="button"
              className={clsx(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border transition",
                index === activeStepIndex
                  ? "border-[#E7C86A] bg-[#0B100E] ring-2 ring-[#E7C86A]/55"
                  : "border-[#0B100E] bg-[#F7F1DC] hover:bg-[#E7C86A]",
              )}
              style={{
                left: `${selectedJourney.steps.length <= 1 ? 0 : (index / (selectedJourney.steps.length - 1)) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              key={`${selectedJourney.slug}-${step.label}`}
              onClick={() => moveToStep(selectedJourney, index)}
              aria-label={`${step.koLabel}로 이동`}
            />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {journeys.slice(0, 3).map((journey) => (
            <button
              type="button"
              className={clsx(
                "truncate rounded-md border px-2 py-2 text-[11px] transition",
                journey.slug === selectedJourney.slug
                  ? "border-[#E7C86A]/80 bg-[#E7C86A]/16 text-[#FFF8DE]"
                  : "border-[#F7F1DC]/22 text-[#F7F1DC]/66 hover:border-[#E7C86A]/55 hover:text-[#FFF8DE]",
              )}
              key={journey.slug}
              onClick={() => selectJourney(journey)}
            >
              {journey.subtitle}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
