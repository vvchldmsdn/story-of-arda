# Story of Arda DB Expansion

This folder contains additive database work for the experience-led Arda archive.

## Files

- `migrations/001_arda_knowledge_graph.sql`: creates the new `arda_*` knowledge graph tables.
- `seeds/001_arda_knowledge_graph_seed.sql`: inserts the first curated era, place, event, and journey data.
- `scripts/apply-arda-knowledge-graph.js`: applies the migration and seed SQL in order.

## Apply

```bash
npm run db:arda
```

The app now reads from the new `arda_*` tables first and falls back to the local curated data when the tables are missing or empty.
