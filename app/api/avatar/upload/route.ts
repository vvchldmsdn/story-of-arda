import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'filename parameter is required' }, { status: 400 });
  };

  if (!request.body) {
    return NextResponse.json({ error: 'request body parameter is required' }, { status: 400 });
  }
 
  const blob = await put(decodeURIComponent(filename), request.body, {
    access: 'public',
  });
 
  return NextResponse.json(blob);
}
