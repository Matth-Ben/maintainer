import { cn } from "@/lib/utils";
import { getUrgencyLabel, getUrgencyColors, getUrgencyDot } from "@/lib/utils/maintenance";
import type { MaintenanceUrgency } from "@/types";

interface MaintenanceBadgeProps {
  urgency: MaintenanceUrgency;
  daysRemaining: number | null;
  className?: string;
}

export function MaintenanceBadge({ urgency, daysRemaining, className }: MaintenanceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        getUrgencyColors(urgency),
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", getUrgencyDot(urgency))} />
      {getUrgencyLabel(urgency, daysRemaining)}
    </span>
  );
}
