const fs = require("fs");
const path = require("path");
const { db } = require("@vercel/postgres");

const root = path.resolve(__dirname, "..");
const files = [
  path.join(root, "migrations", "001_arda_knowledge_graph.sql"),
  path.join(root, "seeds", "001_arda_knowledge_graph_seed.sql"),
];

async function run() {
  const client = await db.connect();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(file, "utf8");
      console.log(`applying ${path.relative(process.cwd(), file)}`);
      await client.query(sql);
    }

    console.log("arda knowledge graph migration and seed complete");
  } finally {
    await client.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
