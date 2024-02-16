'use client'

import { Popover, PopoverTrigger, PopoverContent, ScrollShadow, Image, Card, CardHeader, CardBody, Button, Divider } from "@nextui-org/react";
import parse, { domToReact } from 'html-react-parser';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { RightArrow } from "@/app/lib/icons";
import Link from "next/link";


export default function DetailContents({ titles, contents, heading, overview }: { titles: Array<string>, contents: Array<string>, heading: string, overview: string }) {

  const overviewParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleClick = (urlParam: string) => {
    console.log('in click handler')
    const params = new URLSearchParams(overviewParams);
    params.set('overview', urlParam);
    replace(`${pathname}?${params.toString()}`)
  };

  const showdown = require('showdown');
  const converter = new showdown.Converter({ simpleLineBreaks: true });
  const options = {
    replace: (domNode: any) => {
      switch (domNode.name) {
        case 'p':
          return <p className="my-4 mx-2 text-eeeeee">{domToReact(domNode.children, options)}</p>;
        case 'h1':
          return <h1 className="text-5xl mt-8 mb-4 mx-2 text-ardamint">{domToReact(domNode.children, options)}</h1>;
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
                <p 
                  className="text-ardayellow hover:cursor-pointer inline-block"
                  onClick={() => handleClick(domNode.attribs.href)}
                >{domToReact(domNode.children, options)}</p>
              </PopoverTrigger>
              <PopoverContent>
                <div className="mx-0">
                  <Card className="py-4 w-[300px] bg-ardagrey">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start flex justify-center">
                      <div className="whitespace-normal w-full">
                        <div className="flex justify-between items-center mb-4 text-eeeeee w-full">
                          <h4 className="font-bold text-2xl">{domNode.attribs.href}</h4>
                          <Button className="ml-2" href="/target-page" variant="light">
                            <Link href={`/detail/${domNode.attribs.href}`}><RightArrow /></Link>
                          </Button>
                        </div>
                        <p className="text-default-400 line-clamp-3 text-justify">
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
    <ScrollShadow hideScrollBar className="flex-1 w-11/12">
      <div className="text-justify">
        {parse(converter.makeHtml('# ' + titles[Number(heading)] + `\n\n` + contents[Number(heading)]), options)}
      </div>
    </ScrollShadow>
  )
}