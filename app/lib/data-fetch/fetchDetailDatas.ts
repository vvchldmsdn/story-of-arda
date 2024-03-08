import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchDetailMarkdown(subject: string) {
  noStore();
  const decodedSubject = decodeURIComponent(subject);
  console.log('subject 이름', decodedSubject)
  try {
    const data = await sql`
    SELECT text
    FROM text AS t
    JOIN page AS p ON p.id = t.page_id
    WHERE p.en_name = ${decodedSubject};
    `;

    const result = data.rows.length === 0 ? { text: '' } : data.rows[0];
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch markdown text about ${decodedSubject}`);
  }
};

export async function fetchName(subject: string) {
  noStore();

  const decodedSubject = decodeURIComponent(subject);
  try {
    const data = await sql`
    SELECT name, brief_description
    FROM page AS p
    WHERE p.en_name = ${decodedSubject};
    `;

    const result = data.rows.length === 0 ? { name: '', brief_description: '' } : { name: data.rows[0].name, brief_description: data.rows[0].brief_description };
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch name of ${decodedSubject}`);
  }
}

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
    return result
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch brief description of ${enName} in overview Card`);
  }
};

export async function fetchContentImages(subject: string) {
  try {
    const data = await sql`
    SELECT url
    FROM page_image AS pi
    INNER JOIN page AS p ON p.id = pi.page_id
    WHERE p.en_name = ${subject};
    `;

    const result = data.rows.length === 0 ? [] : data.rows;
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(`Failed to fetch images of ${subject}`);
  }
}