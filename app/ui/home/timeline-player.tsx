'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const activeStepIndex =
    Number.isInteger(stepParam) && stepParam >= 0 && stepParam < selectedJourney.steps.length
      ? stepParam
      : 0;
  const activeStep = selectedJourney.steps[activeStepIndex];
  const progress =
    selectedJourney.steps.length <= 1
      ? 100
      : (activeStepIndex / (selectedJourney.steps.length - 1)) * 100;

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

  const selectJourney = (journey: ArdaJourney) => {
    setIsPlaying(false);
    moveToStep(journey, 0);
  };

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setTimeout(() => {
      const nextIndex =
        activeStepIndex + 1 >= selectedJourney.steps.length ? 0 : activeStepIndex + 1;
      moveToStep(selectedJourney, nextIndex);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [activeStepIndex, isPlaying, moveToStep, selectedJourney]);

  return (
    <section className="rounded-lg border border-[#D6A526]/35 bg-[#101214]/92 text-[#F5F7EF] shadow-2xl shadow-black/35 backdrop-blur-md">
      <div className="grid gap-3 p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#D6A526]">Chronicle</p>
            <span className="h-px flex-1 bg-[#F5F7EF]/12" />
            <p className="text-[11px] text-[#F5F7EF]/52">{activeStepIndex + 1}/{selectedJourney.steps.length}</p>
          </div>
          <h2 className="mt-2 truncate text-base font-semibold leading-6">{selectedJourney.title}</h2>
          <p className="truncate text-xs text-[#F5F7EF]/58">{activeStep.koLabel} - {activeStep.summary}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#F5F7EF]/15 text-sm text-[#F5F7EF]/75 transition hover:border-[#D6A526] hover:text-[#D6A526]"
            onClick={() => moveToStep(selectedJourney, Math.max(0, activeStepIndex - 1))}
            aria-label="이전 사건"
          >
            ‹
          </button>
          <button
            type="button"
            className={clsx(
              "h-9 rounded-md border px-4 text-xs font-semibold transition",
              isPlaying
                ? "border-[#F5F7EF]/20 bg-[#F5F7EF]/10 text-[#F5F7EF]"
                : "border-[#D6A526] bg-[#D6A526] text-[#101214] hover:bg-[#F5F0DF]",
            )}
            onClick={() => setIsPlaying((current) => !current)}
          >
            {isPlaying ? "정지" : "재생"}
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#F5F7EF]/15 text-sm text-[#F5F7EF]/75 transition hover:border-[#D6A526] hover:text-[#D6A526]"
            onClick={() => moveToStep(selectedJourney, Math.min(selectedJourney.steps.length - 1, activeStepIndex + 1))}
            aria-label="다음 사건"
          >
            ›
          </button>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="relative h-2 rounded-full bg-[#F5F7EF]/10">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#D6A526]"
            style={{ width: `${progress}%` }}
          />
          {selectedJourney.steps.map((step, index) => (
            <button
              type="button"
              className={clsx(
                "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border transition",
                index === activeStepIndex
                  ? "border-[#D6A526] bg-[#101214] ring-2 ring-[#D6A526]/45"
                  : "border-[#101214] bg-[#F5F0DF] hover:bg-[#D6A526]",
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
                  ? "border-[#D6A526]/70 bg-[#D6A526]/14 text-[#F5F7EF]"
                  : "border-[#F5F7EF]/12 text-[#F5F7EF]/58 hover:border-[#D6A526]/45 hover:text-[#F5F7EF]",
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
