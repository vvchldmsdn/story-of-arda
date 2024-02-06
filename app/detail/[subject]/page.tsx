import { fetchDetailMarkdown } from "@/app/lib/data-fetch/fetchDetailDatas";
import parse, { domToReact } from 'html-react-parser';
import Link from "next/link";

export default async function Detail({ params }: { params: { subject: string }}) {
  const showdown = require('showdown');
  const converter = new showdown.Converter({simpleLineBreaks: true});
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
  const markDowns = getMarkdown['sa'];

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


  console.log(getMarkdown);
  return (
    <div>
      This is Detail page of {params.subject}
      {markDowns.map((markdown: string) => {
        return (
          <div>{parse(converter.makeHtml(markdown), options)}</div>
        )
      })}
    </div>
  )
}