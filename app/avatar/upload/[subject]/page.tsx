'use client';

import type { PutBlobResult } from '@vercel/blob';
import { Image } from '@nextui-org/react';
import { convertString } from '@/app/lib/utils';
import { useState, useRef } from 'react';
import Link from 'next/link';

export default function AvatarUploadPage({params}: { params: {subject: string}}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const pageTitle = convertString(decodeURIComponent(params.subject));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      setErrorMessage('이미지를 선택해주세요.');
      return;
    }

    const files = Array.from(inputFileRef.current.files);
    const uploadedBlobs: PutBlobResult[] = [];

    try {
      setIsUploading(true);
      setMessage('');
      setErrorMessage('');

      for (const file of files) {
        const response = await fetch(
          `/api/avatar/upload?filename=${encodeURIComponent(file.name)}`,
          {
            method: 'POST',
            body: file,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to upload the image');
        }

        const newBlob = (await response.json()) as PutBlobResult;

        const storeResponse = await fetch(
          `/api/avatar/image-link?subject=${params.subject}&url=${encodeURIComponent(newBlob.url)}`,
          {
            method: 'POST',
          },
        );

        if (!storeResponse.ok) {
          throw new Error('Failed to store the url');
        }

        uploadedBlobs.push(newBlob);
      }

      setBlobs(uploadedBlobs);
      setMessage(`${uploadedBlobs.length}개의 이미지를 추가했습니다.`);
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage('이미지를 추가하지 못했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className='min-h-screen bg-[#0F1411] text-[#F5F0DF]'>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link href={`/detail/${params.subject}`} className="mb-8 inline-flex rounded-md border border-[#D6A526]/40 px-3 py-2 text-sm text-[#F5F0DF]/80 transition hover:border-[#D6A526] hover:text-[#F5F0DF]">
          기록으로 돌아가기
        </Link>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-[#D6A526]/25 bg-[#121812] p-5 shadow-2xl shadow-black/25 sm:p-7">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[#D6A526]">Image Vault</p>
            <h1 className="text-4xl font-semibold leading-tight">{pageTitle}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#F5F0DF]/70">
              이 기록에 연결할 이미지를 추가합니다. 여러 장을 한 번에 올릴 수 있습니다.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <input
                name="file"
                ref={inputFileRef}
                type="file"
                accept="image/*"
                required
                multiple
                className="rounded-md border border-[#F5F0DF]/20 bg-[#0F1411] px-4 py-3 text-sm text-[#F5F0DF] file:mr-4 file:rounded-md file:border-0 file:bg-[#D6A526] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#0F1411]"
              />
              <button
                type="submit"
                disabled={isUploading}
                className="w-fit rounded-md border border-[#D6A526] bg-[#D6A526] px-5 py-2 text-sm font-medium text-[#0F1411] transition hover:bg-[#F5F0DF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? '추가 중' : '이미지 추가'}
              </button>
            </form>

            {message ? <p className="mt-5 text-sm text-[#D6A526]">{message}</p> : null}
            {errorMessage ? <p className="mt-5 text-sm text-[#B23A48]">{errorMessage}</p> : null}
          </div>

          <div className="rounded-lg border border-[#D6A526]/25 bg-[#F5F0DF] p-4 text-[#1B1D18] shadow-2xl shadow-black/20">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-[#B23A48]">Uploaded</p>
            {blobs.length === 0 ? (
              <p className="text-sm leading-7 text-[#1B1D18]/65">아직 추가한 이미지가 없습니다.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {blobs.map((blob) => (
                  <div key={blob.url} className="rounded-md border border-[#1B1D18]/10 p-2">
                    <Image
                      src={blob.url}
                      alt="Uploaded image"
                      className="max-h-[180px] rounded-md object-cover"
                      width={280}
                    ></Image>
                    <a className="mt-2 block break-all text-xs text-[#B23A48]" href={blob.url}>
                      {blob.url}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
