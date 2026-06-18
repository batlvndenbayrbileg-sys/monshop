// Runs during Vercel build: create tables + seed data, but only when a real
// PostgreSQL DATABASE_URL is present. On local builds (no/empty/sqlite URL) it
// safely skips so `npm run build` still works without a database.
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL || "";

if (url.startsWith("postgres")) {
  console.log("🗄️  Postgres detected — syncing schema + seeding...");
  try {
    execSync("prisma db push --skip-generate --accept-data-loss", { stdio: "inherit" });
    execSync("tsx prisma/seed.ts", { stdio: "inherit" });
    console.log("✅ Database ready.");
  } catch (err) {
    console.error("❌ DB setup failed:", err?.message ?? err);
    process.exit(1);
  }
} else {
  console.log("ℹ️  No Postgres DATABASE_URL — skipping DB setup (local build).");
}
