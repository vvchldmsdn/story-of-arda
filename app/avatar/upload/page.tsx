'use client';
 
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
 
export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const file = inputFileRef.current.files[0];
    const fileNameArray = file.name.split('_');
    const tableName = fileNameArray[0];
    const dataName = fileNameArray[1].split('.')[0]

    const response = await fetch(
      `/api/avatar/upload?filename=${file.name}`,
      {
        method: 'POST',
        body: file,
      },
    );

    const newBlob = (await response.json()) as PutBlobResult;

    const storeResponse = await fetch(
      `/api/avatar/image-link?tablename=${tableName}&dataname=${dataName}&url=${newBlob.url}`,
      {
        method: 'POST',
      },
    );

    if (!storeResponse.ok) {
      throw new Error('Failed to store the url');
    }

    setBlob(newBlob);
  };

  return (
    <div className='text-eeeeee'>
      <h1>Upload Your Avatar</h1>
 
      <form
        onSubmit={handleSubmit}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
      {blob && (
        <div>
          Blob url: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </div>
  );
}