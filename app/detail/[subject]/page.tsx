import { fetchDetailMarkdown, fetchName, fetchOverviewBriefDescription } from "@/app/lib/data-fetch/fetchDetailDatas";
import TableOfContent from "@/app/ui/detail/table-of- content";
import { Divider } from "@nextui-org/react";
import DetailContents from "@/app/ui/detail/detail-contents";
import Link from "next/link";
import ContentImages from "@/app/ui/detail/content-images";
import { EditIcon, UploadImageIcon } from "@/app/lib/icons";
import { convertString } from "@/app/lib/utils";
import NameBox from "@/app/ui/molcules/name-box";

export default async function Detail({ params, searchParams }: 
  {
    params: { subject: string },
    searchParams?: { heading?: string, overview?: string }
  }) {
  const heading = searchParams?.heading || '0';
  const overview = searchParams?.overview || '';

  const getPageInfo = await fetchName(params.subject);
  const pageName = getPageInfo.name;
  const pageBriefDescription = getPageInfo.brief_description;

  const getMarkdown = await fetchDetailMarkdown(params.subject);
  const markdown = getMarkdown.text;

  const getBriefDescription = await fetchOverviewBriefDescription(overview);
  
  const convertedSubjectEnName = convertString(decodeURIComponent(params.subject));

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

  const style: React.CSSProperties = {
    background: `radial-gradient(circle at 100% 100%, #222831 0, #222831 19px, transparent 19px) 0% 0%/24px 24px no-repeat,
            radial-gradient(circle at 0 100%, #222831 0, #222831 19px, transparent 19px) 100% 0%/24px 24px no-repeat,
            radial-gradient(circle at 100% 0, #222831 0, #222831 19px, transparent 19px) 0% 100%/24px 24px no-repeat,
            radial-gradient(circle at 0 0, #222831 0, #222831 19px, transparent 19px) 100% 100%/24px 24px no-repeat,
            linear-gradient(#222831, #222831) 50% 50%/calc(100% - 10px) calc(100% - 48px) no-repeat,
            linear-gradient(#222831, #222831) 50% 50%/calc(100% - 48px) calc(100% - 10px) no-repeat,
            linear-gradient(135deg, #00adb5 18%, #FEBF4B 79%)`,
    borderRadius: '24px',
    padding: '9px',
    boxSizing: 'border-box',
  };

  return (
    <div className="flex" style={{ height: 'calc(100vh - 6rem)' }}>
      <div className="flex-none w-72 text-eeeeee h-full flex flex-col pb-8">
        <div className="bg-backblack text-center mx-4 mb-4 py-4 rounded-lg flex-none h-48 flex justify-center items-center relative" style={style}>
          <NameBox
            regionName={pageName}
            convertedRegionEnName={convertedSubjectEnName}
            regionBriefDescription={pageBriefDescription}
          ></NameBox>
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
        <div>
          <ContentImages subject={params.subject}></ContentImages>
        </div>
        
        <DetailContents titles={titles} contents={contents} heading={heading} overview={getBriefDescription}></DetailContents>
      </div>
    </div>
  )
}