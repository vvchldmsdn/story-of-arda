import { NextResponse } from 'next/server';
const { sql } = require('@vercel/postgres');

export async function POST(request: Request): Promise<NextResponse> {
  // const client = await db.connect();

  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const url = searchParams.get('url');
  console.log('넘겨받은 데이터 확인', subject, url);


  if (!subject) {
    return NextResponse.json({ error: 'need information for what page do images go' }, { status: 400 });
  };

  if (!url) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 });
  };

  // put data to page_image table
  try {
    await sql`
    INSERT INTO page_image (page_id, url)
    SELECT id, ${url}
    FROM page
    WHERE page.en_name = ${subject};
    `;

    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}