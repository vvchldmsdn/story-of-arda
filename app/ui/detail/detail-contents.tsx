'use client';

import { Popover, PopoverTrigger, PopoverContent, ScrollShadow, Image } from "@nextui-org/react";
import parse, { domToReact } from 'html-react-parser';
import ContentOverview from "./content-overview";


export default function DetailContents({titles, contents, heading} : {titles: Array<string>, contents: Array<string>, heading: string}) {
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
          return <h2 className="text-3xl mt-8 mb-2 mx-2 text-ardamint">{domToReact(domNode.children, options)}</h2>;
        case 'a': 
          return (
            <Popover className="inline-block" showArrow backdrop="opaque"
              classNames={{
                base: [  
                  // arrow color
                  "before:bg-default-200"
                ],
                content: [
                  "py-0 px-0 border-2 border-ardamint",
                  "bg-ardamint",
                ],
              }}
            >
              <PopoverTrigger className="inline-block">
                <p className="text-ardayellow hover:cursor-pointer inline-block">{domToReact(domNode.children, options)}</p>
              </PopoverTrigger>
              <PopoverContent>
                <div className="mx-0">
                  <ContentOverview link={domNode.attribs.href}></ContentOverview>
                </div>
              </PopoverContent>
            </Popover>
          ) 
        // case 'a':
        //   return <Link className="text-ardayellow hover:cursor-pointer" href={`/detail/${domNode.attribs.href}`}>{domToReact(domNode.children, options)}</Link>
        case 'blockquote':
          return <blockquote className="bg-ardagrey rounded-lg m-2 mx-4 p-2">{domToReact(domNode.children, options)}</blockquote>;
        case 'ul':
          return <ul className="list-disc pl-5">{domToReact(domNode.children, options)}</ul>;
        case 'li':
          return <li className="my-4 text-eeeeee">{domToReact(domNode.children, options)}</li>;
        case 'hr':
          return <hr className="mx-4"></hr>
      };
    }
  };

  return (
    <div className="flex-1 h-full flex justify-center">
      <ScrollShadow hideScrollBar className="h-full w-11/12">
        <Image src="/tmp.jpg" alt="asdf" width={300}></Image>
        <div className="text-justify">
          {parse(converter.makeHtml('# ' + titles[Number(heading)] + `\n\n` + contents[Number(heading)]), options)}
        </div>
      </ScrollShadow>
    </div>
)
}