'use client'

import { inter } from "../../lib/fonts";
import { convertString } from "@/app/lib/utils";
import parse, { domToReact } from 'html-react-parser';
import { useEffect, useState } from 'react';
import Link from "next/link";

export default function ShowDown({ params }: { params: { subject: string } }) {
  const [markdown, setMarkdown] = useState('');
  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const pageTitle = convertString(decodeURIComponent(params.subject));

  useEffect(() => {
    async function fetchMarkdown() {
      try {
        setErrorMessage('');
        const getShowDown = await fetch(
          `/api/showdown?subject=${params.subject}`,
          {
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
        setErrorMessage('기록을 불러오지 못했습니다.');
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
          return <p className="my-5 text-base leading-8 text-[#1B1D18]/86">{domToReact(domNode.children, options)}</p>;
        case 'h1':
          return <h1 className="mb-8 text-4xl font-semibold leading-tight text-[#1B1D18]">{domToReact(domNode.children, options)}</h1>;
        case 'h2':
          return <h2 className="mb-3 mt-10 text-2xl font-semibold text-[#274B3D]">{domToReact(domNode.children, options)}</h2>;
        case 'h3':
          return <h3 className="mb-2 mt-8 text-xl font-semibold text-[#274B3D]">{domToReact(domNode.children, options)}</h3>;
        case 'a':
          return <Link className="text-[#B23A48] underline decoration-[#D6A526]/60 underline-offset-4" href={`/detail/${domNode.attribs.href}`}>{domToReact(domNode.children, options)}</Link>
        case 'blockquote':
          return <blockquote className="my-6 rounded-md border-l-4 border-[#D6A526] bg-[#D6A526]/12 p-4 text-[#1B1D18]/80">{domToReact(domNode.children, options)}</blockquote>;
        case 'ul':
          return <ul className="my-5 list-disc space-y-2 pl-6 text-[#1B1D18]/86">{domToReact(domNode.children, options)}</ul>;
        case 'li':
          return <li className="leading-7">{domToReact(domNode.children, options)}</li>;
        case 'hr':
          return <hr className="my-8 border-[#1B1D18]/15"></hr>
      };
    }
  };

  const handleSave = async () => {
    const method = isEditting ? 'PUT' : 'POST';

    try {
      setIsSaving(true);
      setMessage('');
      setErrorMessage('');

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
        throw new Error('Failed to store markdown');
      };

      setIsEditting(true);
      setMessage('저장했습니다.');
    } catch (error) {
      setErrorMessage('저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={`min-h-screen bg-[#0F1411] text-[#F5F0DF] ${inter.className}`}>
      <header className="border-b border-[#D6A526]/25">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href={`/detail/${params.subject}`} className="mb-5 inline-flex rounded-md border border-[#D6A526]/40 px-3 py-2 text-sm text-[#F5F0DF]/80 transition hover:border-[#D6A526] hover:text-[#F5F0DF]">
              기록으로 돌아가기
            </Link>
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-[#D6A526]">Archive Desk</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{pageTitle}</h1>
            <p className="mt-3 text-sm text-[#F5F0DF]/65">{isEditting ? '기존 기록 업데이트' : '새 기록 등록'}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {message ? <p className="text-sm text-[#D6A526]">{message}</p> : null}
            {errorMessage ? <p className="text-sm text-[#B23A48]">{errorMessage}</p> : null}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-md border border-[#D6A526] bg-[#D6A526] px-5 py-2 text-sm font-medium text-[#0F1411] transition hover:bg-[#F5F0DF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? '저장 중' : '저장'}
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-2">
        <div className="flex min-h-[55vh] flex-col rounded-lg border border-[#D6A526]/25 bg-[#121812] shadow-2xl shadow-black/25 lg:min-h-[70vh]">
          <div className="border-b border-[#F5F0DF]/10 px-4 py-3">
            <p className="text-sm text-[#F5F0DF]/70">마크다운 작성</p>
          </div>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            spellCheck={false}
            className="min-h-[55vh] flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-7 text-[#F5F0DF] outline-none placeholder:text-[#F5F0DF]/40 lg:min-h-[70vh]"
            placeholder={'# 제목\n\n본문을 작성하세요.'}
          />
        </div>

        <div className="min-h-[55vh] overflow-auto rounded-lg bg-[#F5F0DF] p-5 text-[#1B1D18] shadow-2xl shadow-black/25 sm:p-7 lg:min-h-[70vh]">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-[#B23A48]">Preview</p>
          <div className="text-justify">
            {parse(converter.makeHtml(markdown), options)}
          </div>
        </div>
      </section>
    </main>
  )
}
