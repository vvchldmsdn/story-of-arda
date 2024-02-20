'use client'

import { inter } from "../../lib/fonts";
import parse, { domToReact } from 'html-react-parser';
import { useEffect, useState } from 'react';
import Link from "next/link";

export default function ShowDown({ params }: { params: { subject: string } }) {
  const [markdown, setMarkdown] = useState('');
  const [isEditting, setIsEditting] = useState<Boolean>(false);

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        const getShowDown = await fetch(
          `/api/showdown?subject=${params.subject}`, {
          method: 'GET',
        }
        );

        if (!getShowDown.ok) {
          throw new Error('Failed to get the content');
        };

        const data = await getShowDown.json();
        setIsEditting(data.result.edit);
        setMarkdown(data.result.text);
      } catch (error) {
        console.log(error);
        throw new Error(`Failed to fetch markdown data`)
      }
    }

    fetchMarkdown();
  }, [params.subject])

  const tmp = require('showdown');

  const converter = new tmp.Converter({ simpleLineBreaks: true });


  const options = {
    replace: (domNode: any) => {
      switch (domNode.name) {
        case 'p':
          return <p className="my-4 mx-2">{domToReact(domNode.children, options)}</p>;
        case 'h1':
          return <h1 className="text-5xl mt-8 mb-4 mx-2 text-ardamint">{domToReact(domNode.children, options)}</h1>;
        case 'h2':
          return <h2 className="text-3xl mt-8 mb-2 mx-2 text-ardalowmint">{domToReact(domNode.children, options)}</h2>;
        case 'h3':
          return <h3 className="text-xl mt-8 mb-2 mx-2 text-ardalowmint">{domToReact(domNode.children, options)}</h3>
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

  const handleSave = async () => {
    console.log('in page.tsx, markdown =', markdown);
    const method = isEditting ? 'PUT' : 'POST';

    const storeShowDown = await fetch(
      `/api/showdown?subject=${params.subject}`,
      {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markdown })
      }
    );

    if (!storeShowDown.ok) {
      throw new Error('Failed to store the url');
    };
  };

  return (
    <div className={`text-eeeeee ${inter.className} flex flex-col`}>
      <div className="flex flex-row" style={{ height: 'calc(100vh - 2rem)' }}>
        <textarea
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          className="bg-backblack flex-auto border-2 border-ardamint rounded-lg"
        />
        <div className="flex-auto border-eeeeee border-2 rounded-lg overflow-hidden w-72 break-words flex-col" style={{ overflow: "auto" }}>
          {parse(converter.makeHtml(markdown), options)}
        </div>
      </div>
      <div className="flex-none h-8 border-ardayellow border-2 rounded-md flex flex-row">
        <button onClick={handleSave}>저장 // {isEditting ? '업데이트 중' : '새로 등록 중'}</button>
      </div>
    </div>
  )
}