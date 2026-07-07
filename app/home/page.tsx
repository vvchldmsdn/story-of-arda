import { Suspense } from "react";
import { Metadata } from "next";
import MapSearch from "../ui/home/map-search";
import MapChange from "../ui/home/mapChangeText";
import RegionDetail from "../ui/home/region-detail";
import Search from "../ui/home/search";
import WorldExperienceDeck from "../ui/home/world-experience";
import TimelinePlayer from "../ui/home/timeline-player";
import { fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas";
import { fetchArdaJourneysForMap, fetchArdaMapMemoriesForMap } from "../lib/data-fetch/fetchArdaExperience";

type Props = {
  searchParams: {
    query?: string;
    map?: string;
  };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams?.query || "2436.3901 1957.8402";
  const map = searchParams?.map || "Middle Earth";
  const regionData = await fetchRegionName(query, map);
  const regionName = regionData.name;
  const regionBriefDescription = regionData.brief_description;

  return {
    title: regionName,
    description: regionBriefDescription,
    generator: "Next.js",
    keywords: ["lord of the rings", "silmarillion", regionName, "반지의 제왕", "아르다", "중간계"],
    openGraph: {
      title: regionName,
    },
  };
}

export default async function Home({ searchParams }: { searchParams?: { query?: string; map?: string } }) {
  const query = searchParams?.query || "2436.3901 1957.8402";
  const map = searchParams?.map || "Middle Earth";
  const [journeys, mapMemories] = await Promise.all([
    fetchArdaJourneysForMap(map),
    fetchArdaMapMemoriesForMap(map),
  ]);

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#080D0B] text-[#F7F1DC]">
      <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)]">
        <header className="z-40 border-b border-[#E7C86A]/25 bg-[#0A0F0D]/95 px-4 py-3 shadow-2xl shadow-black/45 ring-1 ring-white/5 backdrop-blur-xl sm:px-5">
          <div className="mx-auto flex max-w-[1800px] flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="hidden h-10 w-10 flex-none items-center justify-center rounded-lg border border-[#E7C86A]/40 bg-[#E7C86A]/12 text-sm font-semibold text-[#E7C86A] md:flex">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#E7C86A]">Story of Arda</p>
                <h1 className="truncate text-lg font-semibold leading-6 text-[#F7F1DC]">Interactive Middle-earth Atlas</h1>
              </div>
            </div>
            <div className="grid min-w-0 flex-1 gap-3 lg:max-w-4xl lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <Search />
              <MapChange map={map} />
            </div>
          </div>
        </header>

        <div className="grid min-h-0 gap-3 p-3 lg:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[380px_minmax(0,1fr)_390px]">
          <aside className="hidden min-h-0 lg:block">
            <RegionDetail query={query} map={map} />
          </aside>

          <section className="relative min-h-0 overflow-hidden rounded-xl border border-[#E7C86A]/35 bg-[#101612] shadow-[0_28px_90px_rgba(0,0,0,0.58)] ring-1 ring-white/10">
            <div className="absolute inset-0">
              <MapSearch map={map} journeys={journeys} memories={mapMemories} />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(8,13,11,0.04)_42%,rgba(8,13,11,0.38)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#080D0B]/42 to-transparent" />
            <section className="absolute bottom-3 left-3 right-3 z-30 hidden xl:block">
              <TimelinePlayer journeys={journeys} />
            </section>
          </section>

          <aside className="hidden min-h-0 2xl:block">
            <div className="h-full overflow-hidden rounded-xl border border-[#E7C86A]/30 bg-[#0B100E]/96 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
              <Suspense
                fallback={
                  <div className="rounded-lg border border-[#E7C86A]/35 bg-[#101612] p-4 text-sm text-[#F7F1DC]/72 shadow-xl shadow-black/30">
                    아르다 기록을 불러오는 중입니다.
                  </div>
                }
              >
                <WorldExperienceDeck query={query} map={map} />
              </Suspense>
            </div>
          </aside>

          <section className="max-h-[42dvh] min-h-0 overflow-hidden lg:hidden">
            <RegionDetail query={query} map={map} />
          </section>
        </div>
      </div>
    </main>
  );
}
