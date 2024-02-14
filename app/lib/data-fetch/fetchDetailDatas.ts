import { sql } from "@vercel/postgres";

export async function fetchDetailMarkdown(subject: string) {
  try {
    const data = await sql`
    SELECT text, h_one
    FROM text AS t
    JOIN page AS p ON p.id = t.page_id
    WHERE p.en_name = ${subject};
    `;

    const result = data.rows.length === 0 ? { text: '', h_one: 0 } : data.rows[0];
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch markdown text about ${subject}`);
  }
};

export async function fetchOverviewImage(enName: string) {
  try {
    const data = await sql`
    SELECT url
    FROM page_image AS pi
    INNER JOIN page AS p ON p.id = pi.page_id
    WHERE p.en_name = ${enName};
    `;

    const result = data.rows.length === 0 ? '' : data.rows[0].url;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch overview image of ${enName}`);
  }
};

export async function fetchOverviewBriefDescription(enName: string) {
  console.log(enName)
  try {
    const data = await sql`
    SELECT brief_description AS bd
    FROM page
    WHERE page.en_name = ${enName};
    `;

    const result = data.rows.length === 0 ? '' : data.rows[0].bd;
    console.log('제발제발제발제발제발', result);
    return result
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch brief description of ${enName} in overview Card`);
  }
};