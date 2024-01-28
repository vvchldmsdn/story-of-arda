import CardWrapper from "../ui/home/cards";
import MapSearch from "../ui/home/map-search";
import RegionDetail from "../ui/home/region-detail";
import Search from "../ui/home/search";

export default function Home({ searchParams }: { searchParams?: { query?: string } }) {
  const query = searchParams?.query || '';

  return (
    <div className="flex flex-row pb-4" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="h-full flex-auto basis-3/12 ml-4 mr-2 overflow-hidden">
        {/* 지역 이름, 상세설명 들어갈 부분 */}
        <RegionDetail query={query}></RegionDetail>
      </div>
      <div className="h-full flex-auto basis-7/12 mr-4 flex flex-col">
        <div className="w-full mb-2 flex-1 flex items-center">
          <div className="w-full h-full rounded-3xl overflow-hidden relative">
            {/* 맵 들어갈 부분 */}
            <MapSearch></MapSearch>
            {/* Search 들어갈 부분 */}
            <div className="xl:hidden">
              <Search></Search>
            </div>
          </div>
        </div>
        <div className="w-full h-60 flex-none">
          {/* 대시보드 카드들 들어갈 부분 */}
          <CardWrapper query={query}></CardWrapper>
        </div>
      </div>
      <div className="bg-sky-600 h-full xl:basis-2/12 xl:flex-none xl:mr-4 hidden xl:block">
        {/* 지도 변경 아이콘 */}
        <div className="hidden xl:block">
          <Search></Search>
        </div>
      </div>
    </div>
  )
};