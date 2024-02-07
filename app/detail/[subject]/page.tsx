import { fetchDetailMarkdown } from "@/app/lib/data-fetch/fetchDetailDatas";
import TableOfContent from "@/app/ui/detail/table-of- content";
import parse, { domToReact } from 'html-react-parser';
import Link from "next/link";

export default async function Detail({ params, searchParams }: { params: { subject: string }, searchParams?: { heading?: string } }) {
  const heading = searchParams?.heading || '0';

  const showdown = require('showdown');
  const converter = new showdown.Converter({ simpleLineBreaks: true });
  const options = {
    replace: (domNode: any) => {
      switch (domNode.name) {
        case 'p':
          return <p className="my-4 mx-2 text-eeeeee">{domToReact(domNode.children, options)}</p>;
        case 'h1':
          return <h1 className="text-5xl mt-8 mb-2 mx-2 text-ardamint">{domToReact(domNode.children, options)}</h1>;
        case 'h2':
          return <h2 className="text-3xl mt-8 mb-2 mx-2">{domToReact(domNode.children, options)}</h2>;
        case 'a':
          return <Link className="text-ardayellow hover:cursor-pointer" href={`/detail/${domNode.attribs.href}`}>{domToReact(domNode.children, options)}</Link>
        case 'blockquote':
          return <blockquote className="bg-ardagrey rounded-lg m-2 mx-4 p-2">{domToReact(domNode.children, options)}</blockquote>;
        case 'ul':
          return <ul className="list-disc pl-5">{domToReact(domNode.children, options)}</ul>;
        case 'li':
          return <li className="mb-1">{domToReact(domNode.children, options)}</li>;
        case 'hr':
          return <hr className="mx-4"></hr>
      };
    }
  };

  const getMarkdown = await fetchDetailMarkdown(params.subject);
  const markdown = getMarkdown.text;
  
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

  console.log(titles);
  console.log(contents);

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
    <div className="flex">
      <div className="flex-none w-72 text-eeeeee">
        <TableOfContent contentHeadings={titles}></TableOfContent>
      </div>
      <div className="flex-1">
        {parse(converter.makeHtml(titles[Number(heading)] + contents[Number(heading)]), options)}
      </div>
      {/* <div className="flex-auto w-96">
        {markDowns.map((markdown: string) => {
          return (
            <div key={markdown}>{parse(converter.makeHtml(markdown), options)}</div>
          )
        })}
      </div> */}
    </div>
  )
}