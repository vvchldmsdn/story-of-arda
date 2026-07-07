import { fetchRegionName } from "@/app/lib/data-fetch/fetchHomeDatas";
import {
  getEraMap,
  getRelationshipProfile,
} from "@/app/lib/arda-experience";
import EraBrief from "./era-brief";
import JourneyTrail from "./journey-trail";
import RelationshipGraph from "../shared/relationship-graph";
import { fetchArdaJourneysForMap } from "@/app/lib/data-fetch/fetchArdaExperience";

export default async function WorldExperienceDeck({ query, map }: { query: string; map: string }) {
  const era = getEraMap(map);
  const [journeys, regionData] = await Promise.all([
    fetchArdaJourneysForMap(map),
    fetchRegionName(query, map),
  ]);
  const relationshipProfile = getRelationshipProfile(regionData.en_name, regionData.name || era.map);

  return (
    <div className="flex max-h-full min-h-0 flex-col gap-3 overflow-auto pr-1">
      <EraBrief era={era} />
      <JourneyTrail journeys={journeys} />
      <RelationshipGraph profile={relationshipProfile} compact />
    </div>
  );
}
