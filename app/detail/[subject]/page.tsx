import { fetchDetailMarkdown, fetchOverviewBriefDescription } from "@/app/lib/data-fetch/fetchDetailDatas";
import TableOfContent from "@/app/ui/detail/table-of- content";
import { Divider } from "@nextui-org/react";
import DetailContents from "@/app/ui/detail/detail-contents";
import Link from "next/link";
import ContentImages from "@/app/ui/detail/content-images";
import { EditIcon, UploadImageIcon } from "@/app/lib/icons";
import { convertString } from "@/app/lib/utils";

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
  
  const convertedSubject = convertString(decodeURIComponent(params.subject));

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

  return (
    <div className="flex" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="flex-none w-72 text-eeeeee h-full flex flex-col pb-8">
        <div className="bg-ardagrey mx-4 mb-4 py-4 rounded-lg flex-none h-40 flex justify-center items-center">
          <h1 className="text-center text-4xl text-ardayellow">{convertedSubject}</h1>
        </div>
        <TableOfContent contentHeadings={titles}></TableOfContent>
        <div className="mx-4 mt-6 text-center flex-shrink h-24">
          <div className="flex flex-row justify-between px-10">
            <Link href={{
              pathname: `/showdown/${params.subject}`,
            }}>
              <div className="flex flex-col gap-2 items-center">
                <EditIcon/>
                <p>편집</p>
              </div>
            </Link>
            <Link href={{
              pathname: `/avatar/upload/${params.subject}`,
            }}>
              <div className="flex flex-col gap-2 items-center">
                <UploadImageIcon/>
                <p>이미지 추가</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Divider orientation="vertical" className="bg-eeeeee" />
      <div className="flex-1 h-full flex flex-col justify-center items-center">
        <ContentImages subject={params.subject}></ContentImages>
        <DetailContents titles={titles} contents={contents} heading={heading} overview={getBriefDescription}></DetailContents>
      </div>
    </div>
  )
}