import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from 'next/cache';
import { RegionNameType, RegionDetailType } from "../types/mapTypes";

export async function fetchRegionName(query: string) {
  // noStore();

  const parts: Array<string> = query.split(' ');
  const x: number = parseFloat(parts[0]);
  const y: number = parseFloat(parts[1]);
  console.log('fetchRegionName', x, y)

  try {
    const data = await sql<RegionNameType>`
    SELECT p.name AS name, r.brief_description AS brief_description
    FROM page AS p
    JOIN region AS r ON r.page_id = p.id
    JOIN line AS l ON l.region_id = r.id
    ORDER BY ST_Distance(
      ST_MakeLine(l.start_point, l.end_point),
      ST_SetSRID(ST_MakePoint(${x}, ${y}), 4326)
    ) ASC
    LIMIT 1;
    `;

    const result = data.rows.length === 0 ? { name: "", brief_description: ""} : { name: data.rows[0].name, brief_description: data.rows[0].brief_description};
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
      WHERE page_id = (SELECT id FROM page WHERE name = 'region_name')
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
}

export async function fetchMapUrl(mapName: string) {
  try {
    const data = await sql`
    SELECT image_url
    FROM map
    WHERE name = ${mapName};
    `;

    const result = data.rows.length === 0 ? '' : data.rows[0].name;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch map image of ${mapName}`);
  }
};

// export async function fetchRegionImage(regionName: string) {
//   noStore();

//   try {
//     const data = await sql`
//       SELECT url
//       FROM page_image
//       WHERE page_id = (
//         SELECT id
//         FROM page
//         WHERE name = ${regionName}
//       )
//       ORDER BY RANDOM()
//       LIMIT 1;
//     `;

//     const result = data.rows.length === 0 ? '/swordsman.jpeg' : data.rows[0].url;
//     return result;
//   } catch (error) {
//     console.log(error);
//     throw new Error(`Failed to fetch a random image of ${regionName}`);
//   }
// };