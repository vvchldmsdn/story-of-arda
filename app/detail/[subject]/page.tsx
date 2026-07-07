import { fetchDetailMarkdown, fetchName, fetchOverviewBriefDescription } from "@/app/lib/data-fetch/fetchDetailDatas";
import TableOfContent from "@/app/ui/detail/table-of- content";
import DetailContents from "@/app/ui/detail/detail-contents";
import Image from "next/image";
import Link from "next/link";
import ContentImages from "@/app/ui/detail/content-images";
import { EditIcon, GlobeIcon, UploadImageIcon } from "@/app/lib/icons";
import { convertString } from "@/app/lib/utils";
import { Metadata, ResolvingMetadata } from 'next';
import RelationshipGraph from "@/app/ui/shared/relationship-graph";
import { getRelationshipProfile } from "@/app/lib/arda-experience";


type Props = {
  params: { subject: string }
  searchParams: {
    heading?: string,
    overview?: string,
  }
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const subject = params.subject;

  const getPageInfo = await fetchName(subject);
  const pageName = getPageInfo.name;
  const pageBriefDescription = getPageInfo.brief_description;

  return {
    title: pageName,
    description: pageBriefDescription,
    generator: 'Next.js',
    keywords: ['lord of the rings', 'silmarilion', pageName, '반지의 제왕', '실마릴리온', '중간계'],
    openGraph: {
      title: pageName,
    }
  }
}




export default async function Detail({ params, searchParams }: Props) {
  const heading = searchParams?.heading || '0';
  const overview = searchParams?.overview || '';

  const getPageInfo = await fetchName(params.subject);
  const pageName = getPageInfo.name;
  const pageBriefDescription = getPageInfo.brief_description;

  const getMarkdown = await fetchDetailMarkdown(params.subject);
  const markdown = getMarkdown.text;

  const getBriefDescription = overview ? await fetchOverviewBriefDescription(overview) : '';
  
  const convertedSubjectEnName = convertString(decodeURIComponent(params.subject));
  const relationshipProfile = getRelationshipProfile(params.subject, pageName || convertedSubjectEnName);

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

  if (titles.length === 0 && markdown.trim()) {
    titles.push('개요');
    contents.push(markdown.trim());
  }

  return (
    <main className="min-h-screen bg-[#0F1411] text-[#F5F0DF]">
      <section className="border-b border-[#D6A526]/25 bg-[#0F1411]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-10">
          <div className="flex flex-col justify-end">
            <Link href="/home" className="mb-8 w-fit rounded-md border border-[#D6A526]/40 px-3 py-2 text-sm text-[#F5F0DF]/80 transition hover:border-[#D6A526] hover:text-[#F5F0DF]">
              지도 탐험으로
            </Link>
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#D6A526]">Arda Archive</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-[#F5F0DF] sm:text-5xl">{pageName || convertedSubjectEnName}</h1>
            <p className="mt-3 text-lg text-[#F5F0DF]/65">{convertedSubjectEnName}</p>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#F5F0DF]/78">{pageBriefDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/home"
                className="flex items-center gap-2 rounded-md border border-[#D6A526]/45 px-4 py-2 text-sm text-[#F5F0DF] transition hover:border-[#D6A526] hover:bg-[#D6A526] hover:text-[#0F1411]"
              >
                <GlobeIcon />
                지도 탐험
              </Link>
              <Link
                href={{ pathname: `/showdown/${params.subject}` }}
                className="flex items-center gap-2 rounded-md border border-[#F5F0DF]/25 px-4 py-2 text-sm text-[#F5F0DF]/85 transition hover:border-[#F5F0DF] hover:text-[#F5F0DF]"
              >
                <EditIcon />
                기록 제보
              </Link>
              <Link
                href={{ pathname: `/avatar/upload/${params.subject}` }}
                className="flex items-center gap-2 rounded-md border border-[#F5F0DF]/25 px-4 py-2 text-sm text-[#F5F0DF]/85 transition hover:border-[#F5F0DF] hover:text-[#F5F0DF]"
              >
                <UploadImageIcon />
                이미지 기여
              </Link>
            </div>
          </div>

          <div className="relative min-h-[240px] overflow-hidden rounded-lg border border-[#D6A526]/30 bg-[#1B211C] shadow-2xl shadow-black/30">
            <Image
              src="/SoA.jpeg"
              alt="Story of Arda"
              fill
              priority
              sizes="(min-width: 1024px) 340px, 100vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1411]/80 via-transparent to-transparent"></div>
            <p className="absolute bottom-4 left-4 right-4 text-sm leading-6 text-[#F5F0DF]/82">
              이름과 장소, 사건의 조각들을 이어 아르다의 기록을 읽습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
        <ContentImages subject={params.subject}></ContentImages>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-10">
        <div className="lg:hidden">
          <TableOfContent contentHeadings={titles}></TableOfContent>
        </div>

        <div className="lg:hidden">
          <RelationshipGraph profile={relationshipProfile} compact />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <TableOfContent contentHeadings={titles}></TableOfContent>
            <RelationshipGraph profile={relationshipProfile} compact />
          </div>
        </aside>

        <DetailContents titles={titles} contents={contents} heading={heading} overview={getBriefDescription}></DetailContents>
      </section>
    </main>
  )
}
