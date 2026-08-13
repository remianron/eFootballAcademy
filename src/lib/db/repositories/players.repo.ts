import { prisma } from "@/lib/db/client";
import type { BuildSummaryDto, PlayerDto } from "@/lib/db/types";

function toBuildSummary(
  row: { id: string; slug: string; buildName: string; status: BuildSummaryDto["status"] }
): BuildSummaryDto {
  return {
    id: row.id,
    slug: row.slug,
    buildName: row.buildName,
    status: row.status,
  };
}

function toPlayerDto(
  row: {
    id: string;
    slug: string;
    name: string;
    bio: string | null;
    cards: {
      id: string;
      slug: string;
      cardName: string;
      rarity: string | null;
      position: string;
      overall: number;
      builds: {
        id: string;
        slug: string;
        buildName: string;
        status: BuildSummaryDto["status"];
      }[];
    }[];
  },
  publishOnly: boolean
): PlayerDto {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    bio: row.bio,
    cards: row.cards.map((card) => ({
      id: card.id,
      slug: card.slug,
      cardName: card.cardName,
      rarity: card.rarity,
      position: card.position,
      overall: card.overall,
      builds: card.builds
        .filter((build) => !publishOnly || build.status === "PUBLISHED")
        .map(toBuildSummary),
    })),
  };
}

export async function listPlayers(publishOnly = false): Promise<PlayerDto[]> {
  const rows = await prisma.player.findMany({
    orderBy: { name: "asc" },
    include: {
      cards: {
        orderBy: { cardName: "asc" },
        include: {
          builds: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              slug: true,
              buildName: true,
              status: true,
            },
          },
        },
      },
    },
  });
  return rows.map((row) => toPlayerDto(row, publishOnly));
}

export async function getPlayerBySlug(
  slug: string,
  publishOnly = false
): Promise<PlayerDto | null> {
  const row = await prisma.player.findUnique({
    where: { slug },
    include: {
      cards: {
        orderBy: { cardName: "asc" },
        include: {
          builds: {
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              slug: true,
              buildName: true,
              status: true,
            },
          },
        },
      },
    },
  });
  return row ? toPlayerDto(row, publishOnly) : null;
}