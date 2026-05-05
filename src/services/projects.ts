import { differenceInDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { MaintenanceUrgency, ProjectWithUrgency } from "@/types";

function computeUrgency(
  maint_end_date: string | null,
  has_maintenance: boolean
): { urgency: MaintenanceUrgency; daysRemaining: number | null } {
  if (!has_maintenance || !maint_end_date) return { urgency: "none", daysRemaining: null };
  const days = differenceInDays(new Date(maint_end_date), new Date());
  if (days < 0) return { urgency: "expired", daysRemaining: days };
  if (days <= 15) return { urgency: "critical", daysRemaining: days };
  if (days <= 30) return { urgency: "warning", daysRemaining: days };
  if (days <= 60) return { urgency: "caution", daysRemaining: days };
  return { urgency: "ok", daysRemaining: days };
}

const URGENCY_ORDER: MaintenanceUrgency[] = ["expired", "critical", "warning", "caution", "ok", "none"];

export async function getProjects(): Promise<ProjectWithUrgency[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*, dev:profiles(*)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((p) => {
      const { urgency, daysRemaining } = computeUrgency(p.maint_end_date, p.has_maintenance);
      return { ...p, urgency, daysRemaining, dev: p.dev } as ProjectWithUrgency;
    })
    .sort((a, b) => {
      const diff = URGENCY_ORDER.indexOf(a.urgency) - URGENCY_ORDER.indexOf(b.urgency);
      if (diff !== 0) return diff;
      if (a.daysRemaining !== null && b.daysRemaining !== null) return a.daysRemaining - b.daysRemaining;
      return 0;
    });
}

export async function getProject(id: string): Promise<ProjectWithUrgency | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*, dev:profiles(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const { urgency, daysRemaining } = computeUrgency(data.maint_end_date, data.has_maintenance);
  return { ...data, urgency, daysRemaining, dev: data.dev } as ProjectWithUrgency;
}

export async function getDashboardStats() {
  const projects = await getProjects();
  return {
    total: projects.length,
    withMaintenance: projects.filter((p) => p.has_maintenance).length,
    inDev: projects.filter((p) => p.status === "dev").length,
    critical: projects.filter((p) => p.urgency === "critical" || p.urgency === "warning").length,
    expired: projects.filter((p) => p.urgency === "expired").length,
  };
}
