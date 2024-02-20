'use client'

import { ScrollShadow } from "@nextui-org/react";
import { convertMarkdownToReact } from "@/app/lib/hooks/markdown-to-react";


export default function DetailContents({ titles, contents, heading, overview }: { titles: Array<string>, contents: Array<string>, heading: string, overview: string }) {


  return (
    <ScrollShadow hideScrollBar className="flex-1 w-11/12">
      <div className="text-justify">
        {convertMarkdownToReact('# ' + titles[Number(heading)] + `\n\n` + contents[Number(heading)], overview)}
      </div>
    </ScrollShadow>
  )
}