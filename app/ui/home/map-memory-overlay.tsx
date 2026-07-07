'use client';

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowPathIcon,
  BuildingLibraryIcon,
  ChatBubbleBottomCenterTextIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  FireIcon,
  FlagIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import type { PlaceMemoryEvent } from "@/app/lib/arda-experience";

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

type MemoryKindFilter = "all" | PlaceMemoryEvent["kind"];

type MapMemoryOverlayProps = {
  memories: PlaceMemoryEvent[];
  map: string;
  mapPosition: Position;
  scale: number;
  imageMetrics: ImageMetrics;
};

const kindMeta: Record<PlaceMemoryEvent["kind"], { label: string; shortLabel: string; className: string; Icon: typeof FireIcon }> = {
  battle: {
    label: "전투",
    shortLabel: "전투",
    className: "border-[#E85D4F] bg-[#E85D4F] text-[#101214] ring-[#E85D4F]/30",
    Icon: FireIcon,
  },
  council: {
    label: "회의",
    shortLabel: "회의",
    className: "border-[#76A9FA] bg-[#76A9FA] text-[#101214] ring-[#76A9FA]/30",
    Icon: ChatBubbleBottomCenterTextIcon,
  },
  fall: {
    label: "몰락",
    shortLabel: "몰락",
    className: "border-[#C084FC] bg-[#C084FC] text-[#101214] ring-[#C084FC]/30",
    Icon: ExclamationTriangleIcon,
  },
  founding: {
    label: "건립",
    shortLabel: "건립",
    className: "border-[#D6A526] bg-[#D6A526] text-[#101214] ring-[#D6A526]/30",
    Icon: BuildingLibraryIcon,
  },
  journey: {
    label: "여정",
    shortLabel: "여정",
    className: "border-[#8DD7BF] bg-[#8DD7BF] text-[#101214] ring-[#8DD7BF]/30",
    Icon: MapPinIcon,
  },
  return: {
    label: "귀환",
    shortLabel: "귀환",
    className: "border-[#F5F0DF] bg-[#F5F0DF] text-[#101214] ring-[#F5F0DF]/30",
    Icon: ArrowPathIcon,
  },
};

const filters: Array<{ value: MemoryKindFilter; label: string }> = [
  { value: "all", label: "전체" },
  { value: "battle", label: "전투" },
  { value: "council", label: "회의" },
  { value: "founding", label: "건립" },
  { value: "fall", label: "몰락" },
  { value: "return", label: "귀환" },
];

function getClusterKey(event: PlaceMemoryEvent) {
  return `${event.map}:${event.coords[0].toFixed(1)}:${event.coords[1].toFixed(1)}`;
}

function getClusterOffset(index: number, total: number) {
  if (total <= 1) {
    return { x: 0, y: 0 };
  }

  const radius = Math.min(34, 16 + total * 3);
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export default function MapMemoryOverlay({
  memories,
  map,
  mapPosition,
  scale,
  imageMetrics,
}: MapMemoryOverlayProps) {
  const [activeFilter, setActiveFilter] = useState<MemoryKindFilter>("all");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const selectedMemoryId = searchParams.get("memory");

  const mapMemories = useMemo(
    () => memories.filter((memory) => memory.map === map),
    [map, memories],
  );

  const clusterCounts = useMemo(() => {
    return mapMemories.reduce<Record<string, number>>((counts, memory) => {
      const key = getClusterKey(memory);
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
  }, [mapMemories]);

  const renderedMemories = useMemo(() => {
    const clusterIndexes: Record<string, number> = {};

    return mapMemories
      .map((memory) => {
        const key = getClusterKey(memory);
        const index = clusterIndexes[key] || 0;
        clusterIndexes[key] = index + 1;

        return {
          memory,
          clusterIndex: index,
          clusterTotal: clusterCounts[key] || 1,
        };
      })
      .filter(({ memory }) => activeFilter === "all" || memory.kind === activeFilter);
  }, [activeFilter, clusterCounts, mapMemories]);

  const selectedMemory = useMemo(
    () => mapMemories.find((memory) => memory.id === selectedMemoryId),
    [mapMemories, selectedMemoryId],
  );

  const relatedMemories = useMemo(() => {
    if (!selectedMemory) {
      return [];
    }

    const seen = new Set<string>();

    return mapMemories
      .filter((memory) => memory.id !== selectedMemory.id)
      .filter((memory) => {
        if (seen.has(memory.id)) {
          return false;
        }

        seen.add(memory.id);
        return memory.kind === selectedMemory.kind || memory.era === selectedMemory.era;
      })
      .map((memory) => {
        const distance = Math.hypot(
          memory.coords[0] - selectedMemory.coords[0],
          memory.coords[1] - selectedMemory.coords[1],
        );

        return {
          memory,
          score: memory.kind === selectedMemory.kind ? 0 : 1,
          distance,
        };
      })
      .sort((a, b) => a.score - b.score || a.distance - b.distance)
      .map(({ memory }) => memory)
      .slice(0, 3);
  }, [mapMemories, selectedMemory]);

  if (mapMemories.length === 0 || imageMetrics.width === 0 || imageMetrics.height === 0) {
    return null;
  }

  const getMemoryHref = (memory: PlaceMemoryEvent) => {
    const params = new URLSearchParams(searchParams);
    params.set("map", memory.map);
    params.set("query", `${memory.coords[0]} ${memory.coords[1]}`);
    params.set("memory", memory.id);
    return `${pathname}?${params.toString()}`;
  };

  const selectMemory = (memory: PlaceMemoryEvent) => {
    if (activeFilter !== "all" && activeFilter !== memory.kind) {
      setActiveFilter(memory.kind);
    }

    replace(getMemoryHref(memory));
  };

  const clearMemory = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("memory");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-4 z-20 hidden -translate-x-1/2 md:block">
        <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-[#F7F1DC]/28 bg-[#0B100E]/90 p-1 shadow-xl shadow-black/40 ring-1 ring-white/10 backdrop-blur-xl">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.value;
            const count =
              filter.value === "all"
                ? mapMemories.length
                : mapMemories.filter((memory) => memory.kind === filter.value).length;

            if (count === 0) {
              return null;
            }

            return (
              <button
                type="button"
                className={clsx(
                  "flex h-8 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition",
                  isActive
                    ? "bg-[#F7F1DC] text-[#0B100E]"
                    : "text-[#F7F1DC]/72 hover:bg-[#F7F1DC]/10 hover:text-[#FFF8DE]",
                )}
                key={filter.value}
                data-memory-filter={filter.value}
                data-testid="map-memory-filter"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={isActive}
              >
                <FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{filter.label}</span>
                <span className={clsx("text-[10px]", isActive ? "text-[#0B100E]/55" : "text-[#F7F1DC]/48")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-20 hidden origin-center md:block"
        style={{
          left: mapPosition.x,
          top: mapPosition.y,
          width: imageMetrics.width,
          height: imageMetrics.height,
          transform: `scale(${scale})`,
        }}
      >
        {renderedMemories.map(({ memory, clusterIndex, clusterTotal }) => {
          const left = (memory.coords[0] / imageMetrics.naturalWidth) * imageMetrics.width;
          const top = (memory.coords[1] / imageMetrics.naturalHeight) * imageMetrics.height;
          const offset = getClusterOffset(clusterIndex, clusterTotal);
          const meta = kindMeta[memory.kind];
          const Icon = meta.Icon;
          const isActive = selectedMemoryId === memory.id;

          return (
            <button
              type="button"
              className="group pointer-events-auto absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
              style={{
                left,
                top,
                marginLeft: offset.x,
                marginTop: offset.y,
              }}
              key={`${memory.id}-${memory.coords[0]}-${memory.coords[1]}-${clusterIndex}`}
              data-memory-id={memory.id}
              data-memory-kind={memory.kind}
              data-testid="map-memory-pin"
              onClick={(event) => {
                event.stopPropagation();
                selectMemory(memory);
              }}
              aria-label={`Open memory: ${memory.title}`}
            >
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full border shadow-lg shadow-black/40 transition",
                  isActive
                    ? `${meta.className} ring-4`
                    : "border-[#F5F0DF]/55 bg-[#101214]/82 text-[#F5F0DF]/82 hover:border-[#F5F0DF] hover:bg-[#F5F0DF] hover:text-[#101214]",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>

              <span
                className={clsx(
                  "max-w-[13rem] rounded-md border px-2.5 py-1.5 text-left shadow-lg shadow-black/35 backdrop-blur-md transition",
                  isActive
                    ? "border-[#F5F0DF]/28 bg-[#101214]/94 text-[#F5F0DF]"
                    : "border-[#F5F0DF]/12 bg-[#101214]/78 text-[#F5F0DF]/74 opacity-0 group-hover:opacity-100",
                )}
              >
                <span className="block text-[10px] uppercase tracking-[0.18em] text-[#D6A526]">
                  {memory.dateLabel || meta.shortLabel}
                </span>
                <span className="mt-0.5 block truncate text-xs font-semibold">{memory.title}</span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedMemory ? (
        <aside
          className="pointer-events-none absolute left-1/2 top-20 z-30 hidden w-[32rem] max-w-[calc(100%_-_2rem)] -translate-x-1/2 xl:block"
          data-testid="map-memory-focus"
        >
          <div className="pointer-events-auto overflow-hidden rounded-xl border border-[#F7F1DC]/28 bg-[#0B100E]/94 text-[#F7F1DC] shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-xl">
            <div className="flex items-start gap-3 border-b border-[#F7F1DC]/16 p-4">
              <span
                className={clsx(
                  "mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full border ring-4",
                  kindMeta[selectedMemory.kind].className,
                )}
              >
                {(() => {
                  const Icon = kindMeta[selectedMemory.kind].Icon;
                  return <Icon className="h-4 w-4" aria-hidden="true" />;
                })()}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#E7C86A]">
                    {selectedMemory.dateLabel || kindMeta[selectedMemory.kind].label}
                  </span>
                  <span className="h-px flex-1 bg-[#F7F1DC]/16" />
                  <span className="text-[11px] text-[#F7F1DC]/56">{selectedMemory.era}</span>
                </div>
                <h3 className="mt-2 truncate text-lg font-semibold leading-6">{selectedMemory.title}</h3>
              </div>

              <button
                type="button"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-[#F7F1DC]/22 text-[#F7F1DC]/70 transition hover:border-[#F7F1DC]/45 hover:text-[#FFF8DE]"
                onClick={clearMemory}
                aria-label="Close memory focus"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <p className="text-sm leading-6 text-[#F7F1DC]/84">{selectedMemory.summary}</p>
              <p className="border-l border-[#E7C86A]/55 pl-3 text-xs leading-5 text-[#F7F1DC]/66">
                {selectedMemory.consequence}
              </p>

              {relatedMemories.length > 0 ? (
                <div className="border-t border-[#F7F1DC]/16 pt-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#F7F1DC]/56">연결된 사건</p>
                    <p className="text-[11px] text-[#F7F1DC]/46">{relatedMemories.length}</p>
                  </div>
                  <div className="grid gap-2">
                    {relatedMemories.map((memory) => (
                      <Link
                        href={getMemoryHref(memory)}
                        replace
                        className="group flex items-center gap-3 rounded-md border border-[#F7F1DC]/16 bg-[#F7F1DC]/7 px-3 py-2 text-left transition hover:border-[#E7C86A]/55 hover:bg-[#E7C86A]/12"
                        key={`${selectedMemory.id}-${memory.id}`}
                        data-testid="map-memory-focus-jump"
                        data-memory-id={memory.id}
                        onClick={(event) => {
                          event.stopPropagation();

                          if (activeFilter !== "all" && activeFilter !== memory.kind) {
                            setActiveFilter(memory.kind);
                          }
                        }}
                      >
                        <span className="w-20 flex-none text-[11px] text-[#E7C86A]">{memory.dateLabel}</span>
                        <span className="min-w-0 flex-1 truncate text-xs text-[#F7F1DC]/82">{memory.title}</span>
                        <ChevronRightIcon className="h-4 w-4 flex-none text-[#F7F1DC]/42 transition group-hover:text-[#E7C86A]" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
