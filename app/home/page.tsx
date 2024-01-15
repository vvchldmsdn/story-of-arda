import MapSearch from "../ui/home/map-search";

export default function Home() {
  return (
    <div className="flex flex-row" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="bg-sky-600 h-full basis-2/5 flex-shrink xl:flex-auto xl:basis-4/12 mx-2">
        {/* 지역 이름, 상세설명 들어갈 부분 */}
      </div>
      <div className="h-full basis-3/5 flex-none xl:flex-auto xl:basis-6/12 mr-2 flex flex-col">
        <div className="w-full mb-8 flex-1 flex items-center">
          <div className="bg-teal-300 w-full h-full max-h-96 rounded-3xl overflow-hidden">
            {/* 맵 들어갈 부분 */}
            <MapSearch></MapSearch>
          </div>
        </div>
        <div className="bg-teal-800 w-full h-60 flex-none">
          {/* 대시보드 카드들 들어갈 부분 */}
        </div>
      </div>
      <div className="bg-sky-600 h-full xl:basis-2/12 xl:flex-none xl:mr-2 hidden xl:block">
        {/* 검색 창, 아이콘들 들어갈 부분 */}
      </div>
    </div>
  )
};