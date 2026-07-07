'use client'

import { Popover, PopoverTrigger, PopoverContent, Image, Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import parse, { domToReact } from 'html-react-parser';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { RightArrow } from "@/app/lib/icons";
import Link from "next/link";
import { convertString } from "@/app/lib/utils";

export default function DetailContents({ titles, contents, heading, overview }: { titles: Array<string>, contents: Array<string>, heading: string, overview: string }) {

  const overviewParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (urlParam: string) => {
    const params = new URLSearchParams(overviewParams);
    params.set('overview', urlParam);
    replace(`${pathname}?${params.toString()}`)
  };

  const headingNumber = Number(heading);
  const activeIndex = Number.isInteger(headingNumber) && headingNumber >= 0 && headingNumber < titles.length ? headingNumber : 0;
  const activeTitle = titles[activeIndex] || '기록 없음';
  const activeContent = contents[activeIndex] || '아직 작성된 기록이 없습니다.';

  const showdown = require('showdown');
  const converter = new showdown.Converter({ simpleLineBreaks: true });
  const options = {
    replace: (domNode: any) => {
      switch (domNode.name) {
        case 'p':
          return <p className="my-5 text-base leading-8 text-[#211D12]/88">{domToReact(domNode.children, options)}</p>;
        case 'h1':
          return <h1 className="mb-8 border-b border-[#8B6F2D]/25 pb-5 text-4xl font-semibold leading-tight text-[#15120B]">{domToReact(domNode.children, options)}</h1>;
        case 'h2':
          return <h2 className="mb-3 mt-10 text-2xl font-semibold text-[#243F35]">{domToReact(domNode.children, options)}</h2>;
        case 'h3':
          return <h3 className="mb-2 mt-8 text-xl font-semibold text-[#243F35]">{domToReact(domNode.children, options)}</h3>;
        case 'a':
          return (
            <Popover className="inline-block" showArrow backdrop="opaque"
              classNames={{
                base: [
                  "before:bg-[#D6A526]"
                ],
                content: [
                  "border border-[#8B6F2D]/45 bg-[#F5ECD2] px-0 py-0",
                ],
              }}
            >
              <PopoverTrigger className="inline-block">
                <p 
                  className="inline-block text-[#8C2632] underline decoration-[#8B6F2D]/70 underline-offset-4 hover:cursor-pointer"
                  onClick={() => handleClick(domNode.attribs.href)}
                >{domToReact(domNode.children, options)}</p>
              </PopoverTrigger>
              <PopoverContent>
                <div className="mx-0">
                  <Card className="w-[330px] bg-[#F5ECD2] py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex justify-center">
                      <div className="whitespace-normal w-full">
                        <div className="mb-4 flex w-full items-center justify-between text-[#1B1D18]">
                          <h4 className="font-bold text-2xl">{convertString(domNode.attribs.href)}</h4>
                          <Button className="ml-2" href="/target-page" variant="light">
                            <Link href={`/detail/${domNode.attribs.href}`}><RightArrow /></Link>
                          </Button>
                        </div>
                        <p className="line-clamp-5 text-justify text-sm leading-6 text-[#1B1D18]/70">
                          {overview}
                        </p>
                      </div>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <Image
                        isZoomed
                        alt="Card background"
                        className="object-cover rounded-xl max-h-[160px]"
                        src="/fantasy_background.jpeg"
                        width={300}
                      />
                    </CardBody>
                  </Card>
                </div>
              </PopoverContent>
            </Popover>
          )
        case 'blockquote':
          return <blockquote className="my-6 rounded-md border-l-4 border-[#8B6F2D] bg-[#8B6F2D]/12 p-4 text-[#211D12]/82">{domToReact(domNode.children, options)}</blockquote>;
        case 'ul':
          return <ul className="my-5 list-disc space-y-2 pl-6 text-[#211D12]/88">{domToReact(domNode.children, options)}</ul>;
        case 'li':
          return <li className="leading-7">{domToReact(domNode.children, options)}</li>;
        case 'hr':
          return <hr className="my-8 border-[#211D12]/15"></hr>
        case 'img':
          return <Image src='/swordsman.jpeg' alt={domNode.attribs.alt || 'Content image'} className="float-right ml-4 mt-2 w-40 rounded-md"></Image>
      };
    }
  };

  return (
    <article className="rounded-xl border border-[#E7C86A]/35 bg-[#F5ECD2] px-5 py-6 text-[#211D12] shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/40 sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-4xl text-justify">
        {parse(converter.makeHtml('# ' + activeTitle + `\n\n` + activeContent), options)}
      </div>
    </article>
    
  )
} 
