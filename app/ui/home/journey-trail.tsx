'use client';

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import type { ArdaJourney } from "@/app/lib/arda-experience";

export default function JourneyTrail({ journeys }: { journeys: ArdaJourney[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const requestedJourney = searchParams.get("journey");
  const requestedStep = Number(searchParams.get("step") || "0");

  const initialSlug = journeys.some((journey) => journey.slug === requestedJourney)
    ? requestedJourney!
    : journeys[0]?.slug;
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);

  const selectedJourney = useMemo(
    () => journeys.find((journey) => journey.slug === selectedSlug) || journeys[0],
    [journeys, selectedSlug],
  );

  if (!selectedJourney) {
    return null;
  }

  const activeStep =
    Number.isInteger(requestedStep) && requestedStep >= 0 && requestedStep < selectedJourney.steps.length
      ? requestedStep
      : 0;

  const moveToStep = (stepIndex: number) => {
    const step = selectedJourney.steps[stepIndex];
    const params = new URLSearchParams(searchParams);
    params.set("map", step.map);
    params.set("query", `${step.coords[0]} ${step.coords[1]}`);
    params.set("journey", selectedJourney.slug);
    params.set("step", String(stepIndex));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="rounded-lg border border-[#D6A526]/30 bg-[#101214]/92 text-[#F5F7EF] shadow-2xl shadow-black/30">
      <div className="border-b border-[#F5F7EF]/12 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.22em] text-[#D6A526]">Journey Mode</p>
        <h2 className="mt-2 text-xl font-semibold leading-tight">{selectedJourney.title}</h2>
        <p className="mt-2 text-sm leading-6 text-[#F5F7EF]/68">{selectedJourney.description}</p>
      </div>

      <div className="border-b border-[#F5F7EF]/12 p-3">
        <div className="grid grid-cols-3 gap-2">
          {journeys.slice(0, 3).map((journey) => (
            <button
              type="button"
              className={clsx(
                "rounded-md border px-2 py-2 text-xs leading-5 transition",
                selectedJourney.slug === journey.slug
                  ? "border-[#D6A526] bg-[#D6A526] text-[#101214]"
                  : "border-[#F5F7EF]/12 text-[#F5F7EF]/72 hover:border-[#D6A526]/60 hover:text-[#F5F7EF]",
              )}
              key={journey.slug}
              onClick={() => setSelectedSlug(journey.slug)}
            >
              {journey.subtitle}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[250px] overflow-auto p-3">
        <div className="space-y-2">
          {selectedJourney.steps.map((step, index) => (
            <button
              type="button"
              className={clsx(
                "grid w-full grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-md border px-3 py-3 text-left transition",
                activeStep === index && searchParams.get("journey") === selectedJourney.slug
                  ? "border-[#D6A526] bg-[#D6A526]/14"
                  : "border-[#F5F7EF]/10 bg-[#F5F7EF]/6 hover:border-[#D6A526]/50",
              )}
              key={`${selectedJourney.slug}-${step.label}`}
              onClick={() => moveToStep(index)}
            >
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold",
                  activeStep === index && searchParams.get("journey") === selectedJourney.slug
                    ? "border-[#D6A526] bg-[#D6A526] text-[#101214]"
                    : "border-[#F5F7EF]/18 text-[#D6A526]",
                )}
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{step.koLabel}</span>
                <span className="mt-1 block text-xs leading-5 text-[#F5F7EF]/62">{step.summary}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
