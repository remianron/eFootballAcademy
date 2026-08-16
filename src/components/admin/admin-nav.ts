import type { ComponentType } from "react";
import {
  IconBook,
  IconCompass,
  IconCrosshair,
  IconFlask,
  IconFormation,
  IconGrid,
  IconPulse,
  IconStar,
  IconUsers,
  type IconProps,
} from "@/components/icons";
import type { ContentType } from "@/content/types";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: IconGrid },
  { href: "/admin/builds", label: "Builds", icon: IconCrosshair },
  { href: "/admin/tutorials", label: "Tutorials", icon: IconBook },
  { href: "/admin/formations", label: "Formations", icon: IconFormation },
  { href: "/admin/discoveries", label: "Discoveries", icon: IconFlask },
  { href: "/admin/coaches", label: "Coaches", icon: IconUsers },
  { href: "/admin/bookings", label: "Bookings", icon: IconPulse },
  { href: "/admin/featured", label: "Featured Content", icon: IconStar },
  { href: "/admin/social", label: "Social Links", icon: IconCompass },
];

export const ADMIN_CONTENT_TYPE_ICONS: Record<ContentType, ComponentType<IconProps>> = {
  build: IconCrosshair,
  tutorial: IconBook,
  "formation-guide": IconFormation,
  discovery: IconFlask,
  coach: IconUsers,
};

export function isAdminNavActive(href: string, pathname: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminNavLabel(pathname: string): string {
  const item = ADMIN_NAV_ITEMS.find((candidate) =>
    isAdminNavActive(candidate.href, pathname)
  );
  return item?.label ?? "Dashboard";
}
