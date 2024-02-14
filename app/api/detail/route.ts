import { NextResponse } from "next/server";
const { sql } = require('@vercel/postgres');

export async function GET(request: Request): Promise<NextResponse> {
  const {searchParams} = new URL(request.url);
  const enName = searchParams.get('en_name');

  if (!enName) {
    return NextResponse.json({ error: 'english name is required'}, {status: 400});
  };

  try {
    const data = await sql`
    SELECT brief_description AS bd
    FROM page
    WHERE en_name = ${enName};
    `;
    
    if (data.rows.length === 0) {
      return NextResponse.json({error: `${enName} does not exists in page table`}, {status: 404});
    };

    const briefDescription = data.rows[0].bd;
    return NextResponse.json({briefDescription}, {status: 201});
  } catch (error) {
    console.error('에러 상세 정보:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}