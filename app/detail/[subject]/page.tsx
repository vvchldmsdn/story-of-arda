import { fetchDetailMarkdown, fetchName, fetchOverviewBriefDescription } from "@/app/lib/data-fetch/fetchDetailDatas";
import TableOfContent from "@/app/ui/detail/table-of- content";
import DetailContents from "@/app/ui/detail/detail-contents";
import Image from "next/image";
import Link from "next/link";
import ContentImages from "@/app/ui/detail/content-images";
import { EditIcon, GlobeIcon, UploadImageIcon } from "@/app/lib/icons";
import { convertString } from "@/app/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import RelationshipGraph from "@/app/ui/shared/relationship-graph";
import { getRelationshipProfile } from "@/app/lib/arda-experience";

type Props = {
  params: { subject: string };
  searchParams: {
    heading?: string;
    overview?: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const subject = params.subject;
  const getPageInfo = await fetchName(subject);
  const pageName = getPageInfo.name;
  const pageBriefDescription = getPageInfo.brief_description;

  return {
    title: pageName,
    description: pageBriefDescription,
    generator: "Next.js",
    keywords: ["lord of the rings", "silmarillion", pageName, "반지의 제왕", "아르다", "중간계"],
    openGraph: {
      title: pageName,
    },
  };
}

export default async function Detail({ params, searchParams }: Props) {
  const heading = searchParams?.heading || "0";
  const overview = searchParams?.overview || "";
  const getPageInfo = await fetchName(params.subject);
  const pageName = getPageInfo.name;
  const pageBriefDescription = getPageInfo.brief_description;
  const getMarkdown = await fetchDetailMarkdown(params.subject);
  const markdown = getMarkdown.text;
  const getBriefDescription = overview ? await fetchOverviewBriefDescription(overview) : "";
  const convertedSubjectEnName = convertString(decodeURIComponent(params.subject));
  const relationshipProfile = getRelationshipProfile(params.subject, pageName || convertedSubjectEnName);

  const regex = /(?<=\n|^)#\s(.+)(?=\n)/g;
  let match;
  let lastIndex = 0;
  const titles = [];
  const contents = [];

  while ((match = regex.exec(markdown)) !== null) {
    const title = match[1];
    const start = match.index;

    if (titles.length > 0) {
      contents[contents.length - 1] = markdown.substring(lastIndex, start).trim();
    }

    titles.push(title);
    contents.push("");
    lastIndex = regex.lastIndex;
  }

  if (titles.length > 0) {
    contents[contents.length - 1] = markdown.substring(lastIndex).trim();
  }

  if (titles.length === 0 && markdown.trim()) {
    titles.push("개요");
    contents.push(markdown.trim());
  }

  return (
    <main className="min-h-screen bg-[#080D0B] text-[#F7F1DC]">
      <section className="relative overflow-hidden border-b border-[#E7C86A]/25 bg-[#0A0F0D]">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/SoA.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(231,200,106,0.18),transparent_34%),linear-gradient(90deg,#080D0B_0%,rgba(8,13,11,0.92)_48%,rgba(8,13,11,0.72)_100%)]" />

        <div className="relative mx-auto grid max-w-[1500px] items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-12">
          <div className="flex flex-col justify-end">
            <Link
              href="/home"
              className="mb-8 w-fit rounded-md border border-[#E7C86A]/45 bg-[#E7C86A]/8 px-3 py-2 text-sm text-[#F7F1DC]/86 transition hover:border-[#E7C86A] hover:bg-[#E7C86A] hover:text-[#080D0B]"
            >
              지도 탐험으로
            </Link>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#E7C86A]">Arda Archive</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-[#FFF8DE] sm:text-6xl">
              {pageName || convertedSubjectEnName}
            </h1>
            <p className="mt-3 text-lg text-[#F7F1DC]/70">{convertedSubjectEnName}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[#F7F1DC]/82">{pageBriefDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/home"
                className="flex items-center gap-2 rounded-md border border-[#E7C86A]/60 bg-[#E7C86A]/12 px-4 py-2 text-sm text-[#FFF8DE] transition hover:border-[#E7C86A] hover:bg-[#E7C86A] hover:text-[#080D0B]"
              >
                <GlobeIcon />
                지도 탐험
              </Link>
              <Link
                href={{ pathname: `/showdown/${params.subject}` }}
                className="flex items-center gap-2 rounded-md border border-[#F7F1DC]/28 bg-[#F7F1DC]/6 px-4 py-2 text-sm text-[#F7F1DC]/88 transition hover:border-[#F7F1DC] hover:text-[#FFF8DE]"
              >
                <EditIcon />
                기록 제보
              </Link>
              <Link
                href={{ pathname: `/avatar/upload/${params.subject}` }}
                className="flex items-center gap-2 rounded-md border border-[#F7F1DC]/28 bg-[#F7F1DC]/6 px-4 py-2 text-sm text-[#F7F1DC]/88 transition hover:border-[#F7F1DC] hover:text-[#FFF8DE]"
              >
                <UploadImageIcon />
                이미지 기여
              </Link>
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-[#E7C86A]/35 bg-[#101612] shadow-[0_24px_90px_rgba(0,0,0,0.55)] ring-1 ring-white/10 lg:min-h-[520px]">
            <Image
              src="/SoA.jpeg"
              alt="Story of Arda"
              fill
              priority
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover brightness-110 contrast-125 saturate-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D0B]/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-sm leading-6 text-[#F7F1DC]/86">
              이름과 장소, 사건의 조각을 이어 아르다의 기록을 읽습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 pt-6 sm:px-6">
        <ContentImages subject={params.subject} />
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-10">
        <div className="lg:hidden">
          <TableOfContent contentHeadings={titles} />
        </div>

        <div className="lg:hidden">
          <RelationshipGraph profile={relationshipProfile} compact />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <TableOfContent contentHeadings={titles} />
            <RelationshipGraph profile={relationshipProfile} compact />
          </div>
        </aside>

        <DetailContents titles={titles} contents={contents} heading={heading} overview={getBriefDescription} />
      </section>
    </main>
  );
}
