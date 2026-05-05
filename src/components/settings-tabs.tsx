"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/settings/profile", label: "Profil" },
  { href: "/settings/users", label: "Utilisateurs" },
  { href: "/settings/integrations", label: "Intégrations" },
  { href: "/settings/notifications", label: "Notifications" },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-0.5 border-b mb-6">
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
