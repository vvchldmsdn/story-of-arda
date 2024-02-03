'use client'

import { inter } from "../lib/fonts";
import parse, { domToReact } from 'html-react-parser';
import { useEffect, useState } from 'react';
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { pages } from "../lib/regionNames";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import { motion } from 'framer-motion';


export default function ShowDown() {
  const mapCoordParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [markdown, setMarkdown] = useState('');
  const tmp = require('showdown');

  tmp.extension('customBr', function() {
    return [
      {
        type: 'lang',
        filter: function(text: any) {
          return text.replace(/(\n)/g, '<br/>');
        }
      }
    ];
  });

  const converter = new tmp.Converter({simpleLineBreaks: true});
  

  const options = {
    replace: (domNode: any) => {
      switch (domNode.name) {
        case 'p':
          return <p className="my-4 mx-2">{domToReact(domNode.children, options)}</p>;
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

  const handleSave = async () => {
    console.log('in page.tsx, markdown =', markdown);
    const storeShowDown = await fetch(
      `api/showdown`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ markdown })
      }
    );

    if (!storeShowDown.ok) {
      throw new Error('Failed to store the url');
    };

    // const getShowDown = await fetch(
    //   `api/showdown`,{
    //     method: 'GET',
    //   }
    // );

    // if (!getShowDown.ok) {
    //   throw new Error('Failed to get the content');
    // };

    // const data = await getShowDown.json();
    // console.log('data', data)
    // setDbMarkdown(data.result);
  };

  const handleListItemClick = (value: string) => {
    const params = new URLSearchParams(mapCoordParams);
    params.set('selected', `${value}`);
    replace(`${pathname}?${params.toString()}`)
  };

  return (
    <div className={`text-eeeeee ${inter.className} flex flex-col`}>
      <div className="flex flex-row" style={{ height: 'calc(100vh - 2rem)' }}>
        <textarea
          value={markdown}
          onChange={e => setMarkdown(e.target.value)}
          className="bg-backblack flex-auto border-2 border-ardamint rounded-lg"
        />
        <div className="flex-auto border-eeeeee border-2 rounded-lg overflow-hidden w-72 break-words flex-col" style={{overflow: "auto"}}>
          {parse(converter.makeHtml(markdown), options)}
        </div>
      </div>
      <div className="flex-none h-8 border-ardayellow border-2 rounded-md flex flex-row">
        <div className="w-64 mr-16">
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <Autocomplete
              classNames={{
                base: "max-w-xs",
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-ardayellow text-2xl"  // 화살표 버튼 색
              }}
              scrollShadowProps={{
                isEnabled: false
              }}
              inputProps={{
                classNames: {
                  input: `ml-1`,
                  inputWrapper: "h-[48px] bg-backblack text-eeeeee",
                },
              }}
              listboxProps={{
                hideSelectedIcon: false,
                itemClasses: {
                  base: [
                    "rounded-medium",
                    "text-eeeeee",  // 목록 글자 색
                    "transition-opacity",
                    "data-[hover=true]:text-foreground",
                    "data-[pressed=true]:opacity-70",
                    "data-[hover=true]:bg-ardayellow",  // 목록 호버시 색
                    "data-[selectable=true]:focus:bg-default-100",
                    "data-[focus-visible=true]:ring-default-500",
                  ],
                },
              }}
              aria-label="Select an employee"
              placeholder="Enter employee name"
              popoverProps={{
                offset: 10,
                classNames: {
                  base: "rounded-large",
                  content: "p-1 border-small border-default-100 bg-backblack",  // 목록 박스 테두리 색
                },
              }}
              radius="full"
              variant="bordered"
            >
              {pages.map((page: any) => {
                return (
                  <AutocompleteItem key={page.value} value={page.value}
                    onClick={() => handleListItemClick(page.value)}
                  >
                    {page.value}
                  </AutocompleteItem>
                )
              })}
            </Autocomplete>
          </div>
        </div>
        <button onClick={handleSave}>저장</button>
      </div>
      {/* <div style={{ width: '50%', border: '1px solid black', minHeight: '200px' }}>
        {parse(converter.makeHtml(dbMarkdown), options)}
      </div> */}
      <div className="my-16">{markdown}</div>
    </div>
  )
}