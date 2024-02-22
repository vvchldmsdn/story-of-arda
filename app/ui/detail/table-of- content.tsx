'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EmptyCircle, SelectedCircle } from '@/app/lib/icons';
import { ScrollShadow } from '@nextui-org/react';
import clsx from 'clsx';

export default function TableOfContent({ contentHeadings }: { contentHeadings: Array<string> }) {
  const headingParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const setHeading: any = (idx: number) => {
    const params = new URLSearchParams(headingParams);
    params.set('heading', String(idx));
    replace(`${pathname}?${params.toString()}`);
    setSelectedIdx(idx);
  };

  useEffect(() => {
    const params = new URLSearchParams(headingParams);
    params.set('heading', '0');
    replace(`${pathname}?${params.toString()}`)
  }, [])

  return (
    <ScrollShadow hideScrollBar>
      <div className="flex-auto flex flex-col flex-nowrap justify-center items-center pt-12 bg-ardagrey mx-4 rounded-lg">
        {contentHeadings.map((contentHeading: string, idx: number) => {
          return (
            <div className='w-9/12 flex flex-row items-center h-12 mb-12' key={contentHeading}>
              <div className={clsx('mr-6 h-full flex items-center relative',
                {
                  'before:content-[""] before:absolute before:bg-eeeeee before:w-0.5 before:bg-black before:top-10 before:left-3.5 before:h-16': idx < contentHeadings.length - 1,
                }
              )}>
                {selectedIdx === idx
                  ? <SelectedCircle></SelectedCircle>
                  : <div style={{marginLeft: '0.5em', marginRight: '0.5em'}}><EmptyCircle></EmptyCircle></div> 
                }
              </div>
              <div className={clsx(
                "text-center h-full flex items-center text-lg",
                {
                  "text-ardayellow": selectedIdx === idx
                },
                {
                  "text-eeeeee": selectedIdx !== idx
                }
              )}
                
                onClick={() => setHeading(idx)}
              >
                {contentHeading.slice(2,-2)}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollShadow>
    // <div className="flex-auto flex flex-col flex-nowrap justify-center items-center pt-12 bg-ardagrey mx-4 rounded-lg">
    //   {contentHeadings.map((contentHeading: string, idx: number) => {
    //     return (
    //       <div className='w-9/12 flex flex-row items-center h-12 mb-12' key={contentHeading}>
    //         <div className={clsx('mr-6 h-full flex items-center relative',
    //           {
    //             'before:content-[""] before:absolute before:bg-eeeeee before:w-0.5 before:bg-black before:top-10 before:left-3.5 before:h-16': idx < contentHeadings.length - 1,
    //           }
    //         )}>
    //           {selectedIdx === idx
    //             ? <SelectedCircle></SelectedCircle>
    //             : <div style={{marginLeft: '0.5em', marginRight: '0.5em'}}><EmptyCircle></EmptyCircle></div> 
    //           }
    //         </div>
    //         <div className={clsx(
    //           "text-center h-full flex items-center text-xl",
    //           {
    //             "text-ardayellow": selectedIdx === idx
    //           },
    //           {
    //             "text-eeeeee": selectedIdx !== idx
    //           }
    //         )}
              
    //           onClick={() => setHeading(idx)}
    //         >
    //           {contentHeading.slice(2,-2)}
    //         </div>
    //       </div>
    //     )
    //   })}
    // </div>
  )
}