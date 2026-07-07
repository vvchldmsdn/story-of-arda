import {
  fetchCardCharacterSummary,
  fetchCardEventSummary,
  fetchRandomCharacterName,
  fetchRegionName
} from "@/app/lib/data-fetch/fetchHomeDatas"
import { convertString } from "@/app/lib/utils";
import Link from "next/link";
import PlaceMemory from "./place-memory";
import { fetchArdaPlaceMemories } from "@/app/lib/data-fetch/fetchArdaExperience";

export default async function RegionDetail({ query, map }: { query: string, map: string }) {
  const regionData = await fetchRegionName(query, map);
  const regionName = regionData.name;
  const regionBriefDescription = regionData.brief_description;
  const regionEnName = regionData.en_name;
  const convertedRegionEnName = convertString(regionEnName);
  const hasRegion = Boolean(regionEnName);
  const [totalCharacters, totalEvents, randomCharacterName, placeMemories] = await Promise.all([
    fetchCardCharacterSummary(regionName),
    fetchCardEventSummary(regionName),
    fetchRandomCharacterName(regionName),
    fetchArdaPlaceMemories({ regionEnName, regionName, map }),
  ]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-[#D6A526]/35 bg-[#101214]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-5">
      <div className="flex items-start justify-between gap-4 border-b border-[#F5F7EF]/15 pb-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#D6A526]">{map}</p>
          <h1 className="text-2xl font-semibold leading-tight text-[#F5F7EF] sm:text-3xl">{regionName || '알 수 없는 지역'}</h1>
          <p className="mt-2 break-words text-sm text-[#F5F7EF]/65">{convertedRegionEnName}</p>
        </div>
        {hasRegion ? (
          <Link
            href={`/detail/${regionEnName}`}
            className="flex-none rounded-md border border-[#D6A526]/50 px-3 py-2 text-sm text-[#F5F7EF] transition hover:border-[#D6A526] hover:bg-[#D6A526] hover:text-[#101214]"
          >
            상세 기록
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-[#F5F7EF]/15 bg-[#F5F7EF]/8 p-3">
          <p className="text-xs text-[#F5F7EF]/60">등장 인물</p>
          <p className="mt-1 text-3xl font-semibold text-[#F5F7EF]">{totalCharacters}</p>
        </div>
        <div className="rounded-md border border-[#F5F7EF]/15 bg-[#F5F7EF]/8 p-3">
          <p className="text-xs text-[#F5F7EF]/60">사건</p>
          <p className="mt-1 text-3xl font-semibold text-[#F5F7EF]">{totalEvents}</p>
        </div>
      </div>

      {randomCharacterName ? (
        <p className="mt-3 rounded-md border border-[#D6A526]/25 bg-[#D6A526]/10 px-3 py-2 text-sm text-[#F5F7EF]/80">
          이 지역의 이름: <span className="text-[#F5F7EF]">{randomCharacterName}</span>
        </p>
      ) : null}

      <PlaceMemory
        events={placeMemories}
        fallbackDescription={regionBriefDescription}
        regionName={regionName || '선택한 지역'}
      />
    </div>
  )
};
