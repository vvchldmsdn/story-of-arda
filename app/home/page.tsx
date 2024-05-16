import CardWrapper from "../ui/home/cards";
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
    <div className="flex flex-row py-8 h-screen">
      <div className="h-full flex-auto basis-3/12 ml-4 mr-2 overflow-hidden">
        {/* 지역 이름, 상세설명 들어갈 부분 */}
        <RegionDetail query={query} map={map}></RegionDetail>
      </div>

      <div className="h-full flex-auto basis-7/12 mr-4 flex flex-col">

        <div className="h-56 flex-none w-full flex flex-col justify-between">
          {/* 검색 창 부분 */}
          <div className="mx-auto my-auto">
            <Search></Search>
          </div>
          {/* 맵 변경 Tabs 부분 */}
          <div className="flex flex-row gap-8 justify-center">
            <MapChange map={map}></MapChange>
          </div>
        </div>

        <div className="w-full mt-2 flex-1 flex items-center">
          <div className="w-full h-full rounded-3xl overflow-hidden relative">
            {/* 맵 들어갈 부분 */}
            <MapSearch map={map} query={query}></MapSearch>
          </div>
        </div>

      </div>
      
      <div className="h-full xl:basis-2/12 xl:flex-none xl:mr-4 hidden xl:block flex flex-col">
        <div className={`bg-ardagrey text-eeeeee text-3xl h-56 mb-2 rounded-2xl text-center p-8 flex items-center `}>{`Gondor has no king, Gondor needs no king\n - Boromir -`}</div>
        <CardWrapper query={query} map={map}></CardWrapper>
      </div>
    </div>
  )
};