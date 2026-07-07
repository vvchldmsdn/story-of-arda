'use client';

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowPathIcon,
  BuildingLibraryIcon,
  ChatBubbleBottomCenterTextIcon,
  ExclamationTriangleIcon,
  FireIcon,
  FlagIcon,
  MapPinIcon,
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

  if (mapMemories.length === 0 || imageMetrics.width === 0 || imageMetrics.height === 0) {
    return null;
  }

  const selectMemory = (memory: PlaceMemoryEvent) => {
    const params = new URLSearchParams(searchParams);
    params.set("map", memory.map);
    params.set("query", `${memory.coords[0]} ${memory.coords[1]}`);
    params.set("memory", memory.id);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-[5.5rem] z-20 hidden -translate-x-1/2 md:block">
        <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-[#F5F0DF]/14 bg-[#101214]/78 p-1 shadow-xl shadow-black/30 backdrop-blur-md">
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
                    ? "bg-[#F5F0DF] text-[#101214]"
                    : "text-[#F5F0DF]/62 hover:bg-[#F5F0DF]/10 hover:text-[#F5F0DF]",
                )}
                key={filter.value}
                data-memory-filter={filter.value}
                data-testid="map-memory-filter"
                onClick={() => setActiveFilter(filter.value)}
                aria-pressed={isActive}
              >
                <FlagIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{filter.label}</span>
                <span className={clsx("text-[10px]", isActive ? "text-[#101214]/55" : "text-[#F5F0DF]/38")}>
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
    </>
  );
}
