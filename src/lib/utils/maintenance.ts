import type { MaintenanceUrgency } from "@/types";

export function getUrgencyLabel(urgency: MaintenanceUrgency, days: number | null): string {
  if (urgency === "expired") return `Expiré (${Math.abs(days!)}j)`;
  if (urgency === "critical") return `Critique — ${days}j`;
  if (urgency === "warning") return `Urgent — ${days}j`;
  if (urgency === "caution") return `Attention — ${days}j`;
  if (urgency === "ok") return `OK — ${days}j`;
  return "Sans contrat";
}

export function getUrgencyColors(urgency: MaintenanceUrgency): string {
  switch (urgency) {
    case "expired":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    case "critical":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
    case "caution":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    case "ok":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
}

export function getUrgencyDot(urgency: MaintenanceUrgency): string {
  switch (urgency) {
    case "expired": return "bg-red-500";
    case "critical": return "bg-orange-500";
    case "warning": return "bg-yellow-500";
    case "caution": return "bg-blue-500";
    case "ok": return "bg-green-500";
    default: return "bg-gray-400";
  }
}

export function parseClockifyDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0");
  const minutes = parseInt(match[2] ?? "0");
  return hours + minutes / 60;
}
