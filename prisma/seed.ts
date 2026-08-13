import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { StatCategory } from "@/generated/prisma/client";
import { hashPassword } from "@/lib/auth/password";

/**
 * Canonical eFootball Attribute catalog — Phase 5B seed.
 *
 * Idempotent: upserts by stable `key`, refreshes name/category/sortIndex
 * but preserves the `active` flag (so a retired attribute stays retired).
 * New eFootball attributes are added by appending rows here (or via the
 * future admin panel) — no schema change required.
 *
 * Also seeds the initial OWNER admin account (Phase 6 auth) from
 * ADMIN_EMAIL / ADMIN_PASSWORD when both are set. Existing accounts are
 * never overwritten, so later seed runs cannot reset the password.
 */

type SeedAttribute = {
  key: string;
  name: string;
  category: StatCategory;
  sortIndex: number;
};

const attributes: SeedAttribute[] = [
  // Offensive
  { key: "finishing", name: "Finishing", category: "OFFENSIVE", sortIndex: 1 },
  { key: "offensive_awareness", name: "Offensive Awareness", category: "OFFENSIVE", sortIndex: 2 },
  { key: "ball_control", name: "Ball Control", category: "OFFENSIVE", sortIndex: 3 },
  { key: "dribbling", name: "Dribbling", category: "OFFENSIVE", sortIndex: 4 },
  { key: "tight_possession", name: "Tight Possession", category: "OFFENSIVE", sortIndex: 5 },
  { key: "low_pass", name: "Low Pass", category: "OFFENSIVE", sortIndex: 6 },
  { key: "lofted_pass", name: "Lofted Pass", category: "OFFENSIVE", sortIndex: 7 },
  { key: "kicking_power", name: "Kicking Power", category: "OFFENSIVE", sortIndex: 8 },
  { key: "heading", name: "Heading", category: "OFFENSIVE", sortIndex: 9 },
  { key: "body_control", name: "Body Control", category: "OFFENSIVE", sortIndex: 10 },
  // Defensive
  { key: "defensive_awareness", name: "Defensive Awareness", category: "DEFENSIVE", sortIndex: 11 },
  { key: "ball_winning", name: "Ball Winning", category: "DEFENSIVE", sortIndex: 12 },
  { key: "tackling", name: "Tackling", category: "DEFENSIVE", sortIndex: 13 },
  // Physical
  { key: "jumping", name: "Jumping", category: "PHYSICAL", sortIndex: 14 },
  { key: "physical_contact", name: "Physical Contact", category: "PHYSICAL", sortIndex: 15 },
  { key: "balance", name: "Balance", category: "PHYSICAL", sortIndex: 16 },
  { key: "speed", name: "Speed", category: "PHYSICAL", sortIndex: 17 },
  { key: "acceleration", name: "Acceleration", category: "PHYSICAL", sortIndex: 18 },
  { key: "stamina", name: "Stamina", category: "PHYSICAL", sortIndex: 19 },
  // Goalkeeper
  { key: "gk_awareness", name: "GK Awareness", category: "GOALKEEPER", sortIndex: 20 },
  { key: "gk_catching", name: "GK Catching", category: "GOALKEEPER", sortIndex: 21 },
  { key: "gk_clearing", name: "GK Clearing", category: "GOALKEEPER", sortIndex: 22 },
  { key: "gk_parrying", name: "GK Parrying", category: "GOALKEEPER", sortIndex: 23 },
  { key: "gk_reflexes", name: "GK Reflexes", category: "GOALKEEPER", sortIndex: 24 },
  { key: "gk_reach", name: "GK Reach", category: "GOALKEEPER", sortIndex: 25 },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
  }
  const adapter = new PrismaMariaDb(url);
  const prisma = new PrismaClient({ adapter });

  const existingKeys = new Set(
    (await prisma.attribute.findMany({ select: { key: true } })).map((row) => row.key)
  );

  let inserted = 0;
  let updated = 0;
  for (const attribute of attributes) {
    await prisma.attribute.upsert({
      where: { key: attribute.key },
      update: {
        name: attribute.name,
        category: attribute.category,
        sortIndex: attribute.sortIndex,
      },
      create: attribute,
    });
    if (existingKeys.has(attribute.key)) {
      updated++;
    } else {
      inserted++;
    }
  }

  console.log(
    `Attribute catalog seeded: ${inserted} created, ${updated} updated (${attributes.length} total).`
  );

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const email = adminEmail.trim().toLowerCase();
    const existing = await prisma.adminUser.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      console.log(
        `Admin account "${email}" already exists — password left untouched.`
      );
    } else {
      const passwordHash = await hashPassword(adminPassword);
      await prisma.adminUser.create({
        data: { email, displayName: email, passwordHash },
      });
      console.log(`Admin account "${email}" created.`);
    }
  } else {
    console.log(
      "Admin account skipped — set ADMIN_EMAIL and ADMIN_PASSWORD to seed one."
    );
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});