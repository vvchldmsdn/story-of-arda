import { NextResponse } from 'next/server';
const { sql } = require('@vercel/postgres');

export async function POST(request: Request): Promise<NextResponse> {
  // const client = await db.connect();

  const {searchParams} = new URL(request.url);
  const tableName = searchParams.get('tablename');
  const dataName = searchParams.get('dataname');
  const url = searchParams.get('url');
  console.log('넘겨받은 데이터 확인', tableName, dataName, url);


  if (!tableName) {
    return NextResponse.json({ error: 'tablename parameter is required' }, { status: 400 });
  };

  if (!dataName) {
    return NextResponse.json({ error: 'dataname parameter is required' }, { status: 400 });
  };

  if (!url) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 });
  };

  try {
    // Step 1: FIND the id from the region, person, or item table
    console.log('Step 1 start!!!');
    let findId: any;
    switch (tableName) {
      case 'region':
        findId = await sql`
          SELECT id FROM region
          WHERE name = ${dataName};
        `;
        break;
      case 'person':
        findId = await sql`
          SELECT id FROM person
          WHERE name = ${dataName};
        `;
        break;
      case 'item':
        findId = await sql`
          SELECT id FROM item
          WHERE name = ${dataName};
        `;
        break;
    };

    if (findId.rows.length === 0) {
      return NextResponse.json({ error: `${dataName} does not exists in ${tableName} table` })
    };

    const id = findId.rows[0].id;
    console.log('가져온 id = ', id);

    // Step 2: INSERT the new image link into the region_image, person_image, or item_image table
    switch (tableName) {
      case 'region':
        await sql`
          INSERT INTO region_image (url, item_id)
          VALUES (${url}, ${id});
        `;
        break;
      case 'person':
        await sql`
          INSERT INTO person_image (url, item_id)
          VALUES (${url}, ${id});
        `;
        break;
      case 'item':
        await sql`
          INSERT INTO item_image (url, item_id)
          VALUES (${url}, ${id});
        `;
        break;
    };

    return NextResponse.json({id}, { status: 201 });
  } catch (error) {
    console.error('에러 상세 정보:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}