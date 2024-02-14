import { fetchDetailMarkdown, fetchOverviewBriefDescription } from "@/app/lib/data-fetch/fetchDetailDatas";
import TableOfContent from "@/app/ui/detail/table-of- content";
import { Divider } from "@nextui-org/react";
import DetailContents from "@/app/ui/detail/detail-contents";

export default async function Detail({ params, searchParams }: 
  {
    params: { subject: string },
    searchParams?: { heading?: string, overview?: string }
  }) {
  const heading = searchParams?.heading || '0';
  const overview = searchParams?.overview || '';

  const getMarkdown = await fetchDetailMarkdown(params.subject);
  const markdown = getMarkdown.text;

  const getBriefDescription = await fetchOverviewBriefDescription(overview);

  // h1 태그(#)로 시작하는 줄을 찾는 정규표현식
  const regex = /(?<=\n|^)#\s(.+)(?=\n)/g;
  let match;
  let lastIndex = 0;
  const titles = [];
  const contents = [];

  while ((match = regex.exec(markdown)) !== null) {
    const title = match[1];
    const start = match.index;

    // 이전에 찾은 h1 태그가 있으면 그 사이의 텍스트를 content로 저장
    if (titles.length > 0) {
      contents[contents.length - 1] = markdown.substring(lastIndex, start).trim();
    }

    // 새로운 섹션 시작
    titles.push(title);
    contents.push('');
    lastIndex = regex.lastIndex;
  }

  // 마지막 섹션의 content 저장
  if (titles.length > 0) {
    contents[contents.length - 1] = markdown.substring(lastIndex).trim();
  }

  /* 
  {markDowns.map((markdown: string) => return (<Content/>))}
  로 데이터 넘겨주기.
  일단 전체 다 map으로 렌더링 하고 현재 선택한 목차만 보여주고 나머지는 hidden처리 할 건지,
  아님 선택한 목차에 따라 데이터 새로 넘겨줘서 렌더링 할 건지
  즉 {markDowns.map((markdown: string) => return (<Content/>))} OR <Content/>

  목차는 page.tsx에서 처리 => markDowns의 각 요소에서 h1태그 추출 => how?
  => 목차 생성

  목차 기능 - 1. 목차 이름끼리 선으로 연결
  2. 현재 보고 있는 목차 활성화 UI 처리
  3. 클릭 시 Content 이동
  4. 
  */

  return (
    <div className="flex" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="flex-none w-72 text-eeeeee h-full ">
        <TableOfContent contentHeadings={titles}></TableOfContent>
      </div>
      <Divider orientation="vertical" className="bg-eeeeee" />
      <DetailContents titles={titles} contents={contents} heading={heading} overview={getBriefDescription}></DetailContents>
    </div>
  )
} 