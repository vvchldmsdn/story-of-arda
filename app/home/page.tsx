import CardWrapper from "../ui/home/cards";
import MapSearch from "../ui/home/map-search";
import RegionDetail from "../ui/home/region-detail";

export default function Home({ searchParams }: { searchParams?: { query?: string, detail?: string } }) {
  const query = searchParams?.query || '';
  const detail = searchParams?.detail || '';

  return (
    <div className="flex flex-row pb-4" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="h-full basis-2/5 flex-shrink xl:flex-auto xl:basis-4/12 mx-4 overflow-hidden">
        {/* 지역 이름, 상세설명 들어갈 부분 */}
        <RegionDetail query={query} detail={detail}></RegionDetail>
      </div>
      <div className="h-full basis-3/5 flex-none xl:flex-auto xl:basis-6/12 mr-4 flex flex-col">
        <div className="w-full mb-8 flex-1 flex items-center">
          <div className="w-full h-full rounded-3xl overflow-hidden">
            {/* 맵 들어갈 부분 */}
            <MapSearch></MapSearch>
          </div>
        </div>
        <div className="w-full h-60 flex-none">
          {/* 대시보드 카드들 들어갈 부분 */}
          <CardWrapper></CardWrapper>
        </div>
      </div>
      <div className="bg-sky-600 h-full xl:basis-2/12 xl:flex-none xl:mr-4 hidden xl:block">
        {/* 검색 창, 아이콘들 들어갈 부분 */}
      </div>
    </div>
  )
};