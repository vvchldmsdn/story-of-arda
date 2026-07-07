import {
  fetchCardCharacterSummary,
  fetchCardEventSummary,
  fetchRandomCharacterName,
  fetchRegionName,
} from "@/app/lib/data-fetch/fetchHomeDatas";
import { convertString } from "@/app/lib/utils";
import Link from "next/link";
import PlaceMemory from "./place-memory";
import { fetchArdaPlaceMemories } from "@/app/lib/data-fetch/fetchArdaExperience";

export default async function RegionDetail({ query, map }: { query: string; map: string }) {
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
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#E7C86A]/35 bg-[#0B100E]/97 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10 backdrop-blur-xl sm:p-5">
      <div className="flex items-start justify-between gap-4 border-b border-[#F7F1DC]/20 pb-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs uppercase tracking-[0.24em] text-[#E7C86A]">{map}</p>
          <h1 className="text-2xl font-semibold leading-tight text-[#FFF8DE] sm:text-3xl">
            {regionName || "알 수 없는 지역"}
          </h1>
          <p className="mt-2 break-words text-sm text-[#F7F1DC]/72">{convertedRegionEnName}</p>
        </div>
        {hasRegion ? (
          <Link
            href={`/detail/${regionEnName}`}
            className="flex-none rounded-md border border-[#E7C86A]/70 bg-[#E7C86A]/10 px-3 py-2 text-sm text-[#FFF8DE] transition hover:border-[#E7C86A] hover:bg-[#E7C86A] hover:text-[#0B100E]"
          >
            상세 기록
          </Link>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-[#F7F1DC]/20 bg-[#F7F1DC]/8 p-3 ring-1 ring-white/5">
          <p className="text-xs text-[#F7F1DC]/68">등장 인물</p>
          <p className="mt-1 text-3xl font-semibold text-[#FFF8DE]">{totalCharacters}</p>
        </div>
        <div className="rounded-md border border-[#F7F1DC]/20 bg-[#F7F1DC]/8 p-3 ring-1 ring-white/5">
          <p className="text-xs text-[#F7F1DC]/68">사건</p>
          <p className="mt-1 text-3xl font-semibold text-[#FFF8DE]">{totalEvents}</p>
        </div>
      </div>

      {randomCharacterName ? (
        <p className="mt-3 rounded-md border border-[#E7C86A]/35 bg-[#E7C86A]/12 px-3 py-2 text-sm text-[#F7F1DC]/84">
          이 지역의 이름: <span className="text-[#FFF8DE]">{randomCharacterName}</span>
        </p>
      ) : null}

      <PlaceMemory
        events={placeMemories}
        fallbackDescription={regionBriefDescription}
        regionName={regionName || "선택한 지역"}
      />
    </div>
  );
}
