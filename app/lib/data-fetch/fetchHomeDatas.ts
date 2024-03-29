import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRegionName(query: string, map: string) {
  // noStore();

  const parts: Array<string> = query.split(' ');
  const x: number = parseFloat(parts[0]);
  const y: number = parseFloat(parts[1]);
  console.log('fetch', map)

  let mapId: number;
  switch(map) {
    case 'Middle Earth':
      mapId = 6;
      break;
    case 'Beleriand':
      mapId = 7;
      break;
    case 'Numenor':
      mapId = 8;
      break;
    default:
      mapId = 6;
  }
  console.log('맵 아이디', mapId)

  try {
    const data = await sql`
    SELECT p.name AS name, p.brief_description AS brief_description, p.en_name AS en_name
    FROM page AS p
    JOIN region AS r ON r.page_id = p.id
    JOIN line AS l ON l.region_id = r.id
    WHERE r.map_id = ${mapId}
    ORDER BY ST_Distance(
      ST_MakeLine(l.start_point, l.end_point),
      ST_SetSRID(ST_MakePoint(${x}, ${y}), 4326)
    ) ASC
    LIMIT 1;
    `;

    const result = data.rows.length === 0 ? { name: "", brief_description: "", en_name: ""} : { name: data.rows[0].name, brief_description: data.rows[0].brief_description, en_name: data.rows[0].en_name};
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch region name data');
  }
};

export async function fetchCardCharacterSummary(regionName: string) {
  // noStore();
  try {
    const data = await sql`
    SELECT COUNT(*) AS total
    FROM character_region
    WHERE region_id = (
      SELECT r.id
      FROM page AS p
      JOIN region AS r ON r.page_id = p.id
      WHERE p.name = ${regionName}
    );
    `;
    
    const result: number = data.rows.length === 0 ? 0 : data.rows[0].total;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch the number of characters in ${regionName}`);
  }
};

export async function fetchCardEventSummary(regionName: string) {
  // noStore();
  try {
    const data = await sql`
    SELECT COUNT(*) AS total
    FROM region_event
    WHERE region_id = (
      SELECT r.id
      FROM page AS p
      JOIN region AS r ON r.page_id = p.id
      WHERE name = ${regionName}
    );
    `; 

    const result: number = data.rows.length === 0 ? 0 : data.rows[0].total;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch the number of events in ${regionName}`);
  }
};

export async function fetchRandomCharacterName(regionName: string) {
  noStore();
  
  try {
    const data = await sql`
    WITH region_page AS (
      SELECT id 
      FROM region 
      WHERE page_id = (SELECT id FROM page WHERE name = ${regionName})
    ), character_names AS (
      SELECT p.name
      FROM character AS c
      JOIN character_region cr ON c.id = cr.character_id
      JOIN region_page rp ON cr.region_id = rp.id
      JOIN page p ON c.page_id = p.id
    )
    SELECT name 
    FROM character_names 
    ORDER BY RANDOM() 
    LIMIT 1;
    `;
    
    const result = data.rows.length === 0 ? '' : data.rows[0].name;
    return result;
    // return data.rows[0].name;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch a random character name in ${regionName}`)
  }
};

export async function fetchAllEnname() {
  try {
    const data = await sql`
    SELECT en_name AS name
    FROM page;
    `;

    const result = data.rows.length === 0 ? [] : data.rows;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch page names for sitemap.xml');
  }
}