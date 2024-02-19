import { NextResponse } from 'next/server';
const { sql } = require('@vercel/postgres');

export async function POST(request: Request): Promise<NextResponse> {
  const { markdown } = await request.json();
  console.log('markdown', markdown)
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');

  if (!markdown) {
    return NextResponse.json({ error: 'markdown parameter is required' }, { status: 400});
  };

  try {
    await sql`
      INSERT INTO text (page_id, text)
      SELECT p.id, ${markdown}
      FROM page AS p
      WHERE p.en_name=${subject};
    `;

    return NextResponse.json({markdown}, { status: 201 });
  } catch (error) {
    console.error('에러 상세 정보:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export async function PUT(request: Request): Promise<NextResponse> {
  const { markdown } = await request.json();
  console.log('markdown', markdown)
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');

  if (!markdown) {
    return NextResponse.json({ error: 'markdown parameter is required' }, { status: 400});
  };

  try {
    await sql`
    UPDATE text
    SET text = ${markdown}
    WHERE page_id IN (
      SELECT id
      FROM page
      WHERE en_name = ${subject}
    );
    `;

    return NextResponse.json({markdown}, { status: 201});
  } catch (error) {
    console.log('에러 상세 정보:', error);
    return NextResponse.json({error}, {status: 500})
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  console.log('api에 들어왔음', subject)

  try {
    const data = await sql`
      SELECT text
      FROM text AS t
      INNER JOIN page AS p ON t.page_id = p.id
      WHERE p.en_name=${subject};
    `;
    const result = data.rows.length === 0 ? { text: 'No text yet. Be the First', edit: false} : { text: data.rows[0].text, edit: true};

    return NextResponse.json({result}, {status: 201})
  } catch (error) {
    console.error('에러 상세 정보:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}