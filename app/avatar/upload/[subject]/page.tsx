'use client';
 
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
 
export default function AvatarUploadPage({params}: { params: {subject: string}}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const files = Array.from(inputFileRef.current.files); // Convert FileList to Array
    const blobs = []; // To store the resulting blobs

    /* 
    이제 파일이름을 지정해줄 필욘 없음 아무거나 괜찮 -> POST request 뒤에 parameter 제거하기
    대신 page_image 테이블에 저장할 때 어느 페이지인지 정보 필요 -> parameter로 page의 en_name넘겨주기 -> params.subject를 parameter로
    `/api/avatar/image-link?subject=${params.subject}&url=${newBlob.url}`
    */

    for (const file of files) {
      console.log(file.name);

      const response = await fetch(
        `/api/avatar/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );

      const newBlob = (await response.json()) as PutBlobResult;

      const storeResponse = await fetch(
        `/api/avatar/image-link?subject=${params.subject}&url=${newBlob.url}`,
        {
          method: 'POST',
        },
      );

      if (!storeResponse.ok) {
        throw new Error('Failed to store the url');
      }

      blobs.push(newBlob); // Store the blob
    }

    setBlob(blobs); // Update the state with all blobs
  };

  return (
    <div className='text-eeeeee'>
      <h1>Upload Your Avatar</h1>
 
      <form
        onSubmit={handleSubmit}
      >
        <input name="file" ref={inputFileRef} type="file" required multiple/>
        <button type="submit">Upload</button>
      </form>
      {blob && blob.map((b: any, i: any) => ( // Map over the blobs
        <div key={i}>
          Blob url: <a href={b.url}>{b.url}</a>
        </div>
      ))}
    </div>
  );
}