'use client';
 
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
 
export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputFileRef.current?.files) {
      throw new Error('No file selected');
    }

    const files = Array.from(inputFileRef.current.files); // Convert FileList to Array
    const blobs = []; // To store the resulting blobs

    for (const file of files) {
      console.log(file.name);
      const fileNameArray = file.name.split('_');
      const tableName = fileNameArray[0];
      // const dataName = fileNameArray[1].split('.')[0]
      const dataName = fileNameArray[1];

      const response = await fetch(
        `/api/avatar/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );

      const newBlob = (await response.json()) as PutBlobResult;

      // const storeResponse = await fetch(
      //   `/api/avatar/image-link?tablename=${tableName}&dataname=${dataName}&url=${newBlob.url}`,
      //   {
      //     method: 'POST',
      //   },
      // );

      // if (!storeResponse.ok) {
      //   throw new Error('Failed to store the url');
      // }

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