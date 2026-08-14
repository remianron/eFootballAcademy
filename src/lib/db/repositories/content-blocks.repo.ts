import { prisma } from "@/lib/db/client";
import type { Prisma, MediaOwnerType } from "@/generated/prisma/client";
import type { ContentBlockDto } from "@/lib/db/types";
import type { NormalizedContentBlock } from "@/lib/content-blocks/types";
import { toContentBlockDto } from "@/lib/content-blocks/parse";

type Tx = Prisma.TransactionClient;

function toDto(row: {
  id: string;
  type: string;
  data: Prisma.JsonValue;
  order: number;
}): ContentBlockDto | null {
  return toContentBlockDto({ id: row.id, type: row.type, data: row.data, order: row.order });
}

export async function getContentBlocks(
  ownerType: MediaOwnerType,
  ownerId: string
): Promise<ContentBlockDto[]> {
  const rows = await prisma.contentBlock.findMany({
    where: { ownerType, ownerId },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return rows
    .map((row) => toDto(row))
    .filter((block): block is ContentBlockDto => block !== null);
}

export async function contentBlocksForOwner(
  ownerType: MediaOwnerType,
  ownerIds: string[]
): Promise<Map<string, ContentBlockDto[]>> {
  if (ownerIds.length === 0) return new Map();
  const rows = await prisma.contentBlock.findMany({
    where: { ownerType, ownerId: { in: ownerIds } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const grouped = new Map<string, ContentBlockDto[]>();
  for (const row of rows) {
    const dto = toDto(row);
    if (!dto) continue;
    const list = grouped.get(row.ownerId) ?? [];
    list.push(dto);
    grouped.set(row.ownerId, list);
  }
  return grouped;
}

/**
 * Deletes and recreates all blocks for an owner inside the save
 * transaction — the same pattern the editor repositories already use
 * for media and child rows.
 */
export async function syncContentBlocks(
  tx: Tx,
  ownerType: MediaOwnerType,
  ownerId: string,
  blocks: NormalizedContentBlock[]
): Promise<void> {
  await tx.contentBlock.deleteMany({ where: { ownerType, ownerId } });
  if (blocks.length === 0) return;
  await tx.contentBlock.createMany({
    data: blocks.map((block, index) => ({
      ownerType,
      ownerId,
      type: block.type,
      data: block as unknown as Prisma.InputJsonValue,
      order: index + 1,
    })),
  });
}