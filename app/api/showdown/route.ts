import { NextResponse } from 'next/server';
const { sql } = require('@vercel/postgres');

export async function POST(request: Request): Promise<NextResponse> {
  const { markdown } = await request.json();
  console.log('markdown', markdown)

  if (!markdown) {
    return NextResponse.json({ error: 'markdown parameter is required' }, { status: 400});
  };

  try {
    await sql`
      INSERT INTO text (page_id, text, h_one)
      VALUES (8, ${markdown}, 4);
    `;

    return NextResponse.json({markdown}, { status: 201 });
  } catch (error) {
    console.error('에러 상세 정보:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
};

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const data = await sql`
      SELECT content
      FROM text
      WHERE id = 1;
    `;

    if (data.rows.length === 0) {
      return NextResponse.json({ error: 'no data matching'}, {status: 503})
    }
    
    const result = data.rows[0].content;
    return NextResponse.json({result}, {status: 201})
  } catch (error) {
    console.error('에러 상세 정보:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}