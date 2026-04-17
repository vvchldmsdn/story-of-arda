import MapSearch from "../ui/home/map-search";
import MapChange from "../ui/home/mapChangeText";
import RegionDetail from "../ui/home/region-detail";
import Search from "../ui/home/search";
import { Metadata } from 'next';
import { fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas"

type Props = {
  searchParams: {
    query?: string,
    map?: string,
  }
}


export async function generateMetadata(
  { searchParams }: Props,
): Promise<Metadata> {
  const query = searchParams?.query || '2436.3901 1957.8402';
  const map = searchParams?.map || 'Middle Earth';
  const regionData = await fetchRegionName(query, map);
  const regionName = regionData.name;
  const regionBriefDescription = regionData.brief_description;

  return {
    title: regionName,
    description: regionBriefDescription,
    generator: 'Next.js',
    keywords: ['lord of the rings', 'silmarilion', regionName, '반지의 제왕', '실마릴리온', '중간계'],
    openGraph: {
      title: regionName,
    }
  }
}



export default function Home({ searchParams }: { searchParams?: { query?: string, map?: string } }) {
  const query = searchParams?.query || '2436.3901 1957.8402';
  const map = searchParams?.map || 'Middle Earth';

  return (
    <main className="relative h-screen overflow-hidden bg-[#101214] text-[#F5F7EF]">
      <div className="absolute inset-0">
        <MapSearch map={map}></MapSearch>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#101214]/80 via-[#101214]/10 to-[#101214]/85"></div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#101214]/85 via-[#101214]/20 to-transparent lg:w-1/2"></div>
      </div>

      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 px-4 py-4 sm:px-6 sm:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="pointer-events-auto w-full max-w-xl">
            <Search></Search>
          </div>
          <div className="pointer-events-auto">
            <MapChange map={map}></MapChange>
          </div>
        </div>
      </div>

      <section className="absolute bottom-4 left-4 right-4 z-20 max-h-[46vh] md:bottom-6 md:left-6 md:right-auto md:top-28 md:max-h-none md:w-[420px]">
        <RegionDetail query={query} map={map}></RegionDetail>
      </section>

      <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden max-w-xs border-l border-[#D6A526]/40 pl-4 text-sm leading-6 text-[#F5F7EF]/75 lg:block">
        지도를 끌어 이동하고, 휠로 확대하세요. 궁금한 땅을 누르면 기록이 열립니다.
      </div>
    </main>
  )
};
