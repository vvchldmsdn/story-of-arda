'use client';

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ScrollShadow } from "@nextui-org/react";
import type { PlaceMemoryEvent } from "@/app/lib/arda-experience";
import { notoSansKr } from "@/app/lib/fonts";

const kindLabels: Record<PlaceMemoryEvent["kind"], string> = {
  battle: "전투",
  council: "회의",
  fall: "전환",
  founding: "건립",
  journey: "여정",
  return: "귀환",
};

type PlaceMemoryProps = {
  events: PlaceMemoryEvent[];
  fallbackDescription: string;
  regionName: string;
};

export default function PlaceMemory({ events, fallbackDescription, regionName }: PlaceMemoryProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const selectedMemoryId = searchParams.get("memory");
  const initialIndex = Math.max(
    0,
    events.findIndex((event) => event.id === selectedMemoryId),
  );
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  const selectedEvent = useMemo(
    () => events[selectedIndex] || events[0],
    [events, selectedIndex],
  );

  const selectMemory = (event: PlaceMemoryEvent, index: number) => {
    setSelectedIndex(index);

    const params = new URLSearchParams(searchParams);
    params.set("map", event.map);
    params.set("query", `${event.coords[0]} ${event.coords[1]}`);
    params.set("memory", event.id);
    replace(`${pathname}?${params.toString()}`);
  };

  if (!selectedEvent) {
    return (
      <div className="mt-4 min-h-0 flex-1 overflow-hidden">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#B23A48]">기록</p>
        <ScrollShadow hideScrollBar className="h-full w-full pr-1" size={80}>
          <p className={`whitespace-pre-line text-justify text-sm leading-7 text-[#F5F7EF]/82 ${notoSansKr.className}`}>
            {fallbackDescription || '선택한 지역의 기록이 아직 없습니다.'}
          </p>
        </ScrollShadow>
      </div>
    );
  }

  return (
    <div className="mt-4 min-h-0 flex-1 overflow-hidden">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-[#B23A48]">장소의 기억</p>
        <p className="text-xs text-[#F5F7EF]/50">{regionName}</p>
      </div>

      <div className="mb-3 grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-3">
        <div className="space-y-2">
          {events.slice(0, 4).map((event, index) => (
            <button
              type="button"
              className={clsx(
                "w-full rounded-md border px-3 py-2 text-left transition",
                selectedEvent.id === event.id
                  ? "border-[#D6A526] bg-[#D6A526] text-[#101214]"
                  : "border-[#F5F7EF]/12 bg-[#F5F7EF]/6 text-[#F5F7EF]/76 hover:border-[#D6A526]/50",
              )}
              key={event.id}
              onClick={() => selectMemory(event, index)}
            >
              <span className="block text-[11px] font-medium">{event.dateLabel}</span>
              <span className="mt-1 block truncate text-xs font-semibold">{event.title}</span>
            </button>
          ))}
        </div>

        <article className="rounded-md border border-[#F5F7EF]/12 bg-[#F5F7EF]/7 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full border border-[#D6A526]/45 px-2 py-1 text-[11px] text-[#D6A526]">
              {kindLabels[selectedEvent.kind]}
            </span>
            <span className="text-[11px] text-[#F5F7EF]/50">{selectedEvent.era}</span>
          </div>
          <h2 className="mt-3 text-base font-semibold leading-6 text-[#F5F7EF]">{selectedEvent.title}</h2>
          <p className="mt-2 text-xs leading-5 text-[#F5F7EF]/72">{selectedEvent.summary}</p>
        </article>
      </div>

      <ScrollShadow hideScrollBar className="h-full w-full pr-1" size={80}>
        <div className={`text-justify text-sm leading-7 text-[#F5F7EF]/82 ${notoSansKr.className}`}>
          <p>{selectedEvent.consequence}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedEvent.relatedSubjects.map((subject) => (
              <span
                className="rounded-full border border-[#F5F7EF]/12 bg-black/15 px-3 py-1 text-xs text-[#F5F7EF]/68"
                key={`${selectedEvent.id}-${subject}`}
              >
                {subject}
              </span>
            ))}
          </div>
          <p className="mt-4 whitespace-pre-line text-[#F5F7EF]/62">{fallbackDescription}</p>
        </div>
      </ScrollShadow>
    </div>
  );
}
