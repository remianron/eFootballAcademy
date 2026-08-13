import { prisma } from "@/lib/db/client";
import type { AttributeDto } from "@/lib/db/types";

type AttributeRow = {
  id: string;
  key: string;
  name: string;
  category: AttributeDto["category"];
  sortIndex: number;
  active: boolean;
};

function toDto(row: AttributeRow): AttributeDto {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    category: row.category,
    sortIndex: row.sortIndex,
    active: row.active,
  };
}

export async function listActiveAttributes(): Promise<AttributeDto[]> {
  const rows = await prisma.attribute.findMany({
    where: { active: true },
    orderBy: { sortIndex: "asc" },
  });
  return rows.map(toDto);
}

export async function listAllAttributes(): Promise<AttributeDto[]> {
  const rows = await prisma.attribute.findMany({
    orderBy: [{ active: "desc" }, { sortIndex: "asc" }],
  });
  return rows.map(toDto);
}

export async function getAttributeByKey(
  key: string
): Promise<AttributeDto | null> {
  const row = await prisma.attribute.findUnique({ where: { key } });
  return row ? toDto(row) : null;
}