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
