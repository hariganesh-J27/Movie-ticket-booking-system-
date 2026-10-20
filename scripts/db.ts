// Runs the SQL files in db/ against DATABASE_URL.
//   npm run db:setup   -> schema.sql + routines.sql
//   npm run db:seed    -> seed.sql
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

const FILES: Record<string, string> = {
  schema: "schema.sql",
  routines: "routines.sql",
  seed: "seed.sql",
};

async function main() {
  const steps = process.argv.slice(2);
  const unknown = steps.filter((s) => !FILES[s]);
  if (steps.length === 0 || unknown.length > 0) {
    console.error(`Usage: tsx scripts/db.ts <${Object.keys(FILES).join("|")}>...`);
    process.exit(1);
  }

  // Prefer the direct (non-pooled) URL for DDL when one is configured.
  const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  client.on("notice", (n) => console.log(`  ${n.message}`));
  await client.connect();

  try {
    for (const step of steps) {
      console.log(`Running db/${FILES[step]} ...`);
      await client.query(readFileSync(join(process.cwd(), "db", FILES[step]), "utf8"));
    }
    console.log("Done.");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
