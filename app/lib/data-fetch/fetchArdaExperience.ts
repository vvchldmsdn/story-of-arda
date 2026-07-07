import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import {
  getJourneysForMap,
  getPlaceMemories,
  type ArdaJourney,
  type JourneyStep,
  type PlaceMemoryEvent,
} from "@/app/lib/arda-experience";

type JourneyRow = {
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  step_order: number;
  step_title: string;
  step_summary: string;
  step_label: string | null;
  map_name: string;
  x: number | string | null;
  y: number | string | null;
};

type PlaceMemoryRow = {
  id: string;
  map_name: string;
  x: number | string | null;
  y: number | string | null;
  era: string;
  date_label: string | null;
  kind: PlaceMemoryEvent["kind"] | null;
  title: string;
  summary: string;
  consequence: string | null;
};

function toNumber(value: number | string | null, fallback: number) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toJourneyStep(row: JourneyRow): JourneyStep {
  return {
    label: row.step_label || row.step_title,
    koLabel: row.step_title,
    map: row.map_name,
    coords: [toNumber(row.x, 0), toNumber(row.y, 0)],
    summary: row.step_summary,
  };
}

export async function fetchArdaJourneysForMap(map: string): Promise<ArdaJourney[]> {
  noStore();

  try {
    const data = await sql<JourneyRow>`
      SELECT
        j.slug,
        j.title,
        j.subtitle,
        j.description,
        s.step_order,
        s.title AS step_title,
        s.summary AS step_summary,
        COALESCE(p.english_name, p.name, s.title) AS step_label,
        mp.map_name,
        ST_X(s.point) AS x,
        ST_Y(s.point) AS y
      FROM arda_journey AS j
      JOIN arda_journey_step AS s ON s.journey_id = j.id
      JOIN arda_map_profile AS mp ON mp.id = s.map_profile_id
      LEFT JOIN arda_place AS p ON p.id = s.place_id
      WHERE mp.map_name = ${map}
      ORDER BY j.sort_order ASC, s.step_order ASC;
    `;

    if (data.rows.length === 0) {
      return getJourneysForMap(map);
    }

    const journeys = new Map<string, ArdaJourney>();

    for (const row of data.rows) {
      const existing = journeys.get(row.slug);

      if (existing) {
        existing.steps.push(toJourneyStep(row));
      } else {
        journeys.set(row.slug, {
          slug: row.slug,
          title: row.title,
          subtitle: row.subtitle || row.title,
          description: row.description,
          steps: [toJourneyStep(row)],
        });
      }
    }

    return Array.from(journeys.values()).filter((journey) => journey.steps.length > 0);
  } catch (error) {
    return getJourneysForMap(map);
  }
}

export async function fetchArdaPlaceMemories({
  regionEnName,
  regionName,
  map,
}: {
  regionEnName: string;
  regionName: string;
  map: string;
}): Promise<PlaceMemoryEvent[]> {
  noStore();

  try {
    const data = await sql<PlaceMemoryRow>`
      SELECT
        e.slug AS id,
        mp.map_name,
        ST_X(el.point) AS x,
        ST_Y(el.point) AS y,
        era.name AS era,
        e.date_label,
        e.event_kind AS kind,
        e.title,
        e.summary,
        e.consequence
      FROM arda_event AS e
      JOIN arda_event_location AS el ON el.event_id = e.id
      JOIN arda_map_profile AS mp ON mp.id = el.map_profile_id
      JOIN arda_era AS era ON era.id = e.era_id
      LEFT JOIN arda_place AS p ON p.id = el.place_id
      WHERE
        mp.map_name = ${map}
        AND (
          LOWER(p.slug) = LOWER(${regionEnName})
          OR LOWER(p.english_name) = LOWER(${regionEnName})
          OR LOWER(p.name) = LOWER(${regionName})
          OR EXISTS (
            SELECT 1
            FROM arda_place_alias AS alias
            WHERE alias.place_id = p.id
              AND LOWER(alias.alias) IN (LOWER(${regionEnName}), LOWER(${regionName}))
          )
        )
      ORDER BY e.sequence_order ASC, el.location_order ASC;
    `;

    if (data.rows.length === 0) {
      return getPlaceMemories(regionEnName, regionName, map);
    }

    return data.rows.map((row) => ({
      id: row.id,
      placeKeys: [regionEnName, regionName],
      map: row.map_name,
      coords: [toNumber(row.x, 0), toNumber(row.y, 0)],
      era: row.era,
      dateLabel: row.date_label || "",
      kind: row.kind || "journey",
      title: row.title,
      summary: row.summary,
      consequence: row.consequence || "",
      relatedSubjects: [],
    }));
  } catch (error) {
    return getPlaceMemories(regionEnName, regionName, map);
  }
}
