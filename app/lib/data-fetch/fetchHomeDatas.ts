import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from 'next/cache';
import { RegionNameType, RegionDetailType } from "../types/mapTypes";

export async function fetchRegionName(query: string) {
  noStore();

  const parts: Array<string> = query.split(' ');
  const x: number = parseFloat(parts[0]);
  const y: number = parseFloat(parts[1]);

  try {
    const data = await sql<RegionNameType>`
    SELECT r.name
    FROM region AS r
    JOIN region_line AS rl ON r.id = rl.region_id
    JOIN (
      SELECT id
      FROM line
      ORDER BY ST_Distance(
        ST_MakeLine(start_point, end_point),
        ST_MakePoint(${x}, ${y})
      ) ASC
      LIMIT 1
    ) AS nearest_line ON rl.line_id = nearest_line.id;
    `;
    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch region name data');
  }
};

export async function fetchRegionDetail(regionName: string, detailName: string) {
  noStore();

  try {
    const data = await sql<RegionDetailType>`
    SELECT ${detailName}
    FROM region
    WHERE name = ${regionName};
    `;
    console.log(data.rows);
    return data.rows;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch region ${detailName} data`)
  }
};