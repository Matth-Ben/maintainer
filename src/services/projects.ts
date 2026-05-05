import { differenceInDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { MaintenanceUrgency, ProjectWithUrgency, Profile } from "@/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

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

function mergeProjectWithDev(project: ProjectRow, profilesMap: Map<string, ProfileRow>): ProjectWithUrgency {
  const { urgency, daysRemaining } = computeUrgency(project.maint_end_date, project.has_maintenance);
  const devRow = profilesMap.get(project.dev_id);
  const dev: Profile = devRow
    ? { id: devRow.id, full_name: devRow.full_name, role: devRow.role }
    : { id: project.dev_id, full_name: "Inconnu", role: "user" };
  return { ...project, urgency, daysRemaining, dev };
}

async function fetchProfilesMap(supabase: Awaited<ReturnType<typeof createClient>>): Promise<Map<string, ProfileRow>> {
  const { data } = await supabase.from("profiles").select("*") as { data: ProfileRow[] | null; error: unknown };
  const map = new Map<string, ProfileRow>();
  for (const p of data ?? []) map.set(p.id, p);
  return map;
}

export async function getProjects(): Promise<ProjectWithUrgency[]> {
  const supabase = await createClient();

  const [{ data: projects, error }, profilesMap] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    fetchProfilesMap(supabase),
  ]);

  if (error) throw new Error(error.message);

  return (projects ?? [])
    .map((p) => mergeProjectWithDev(p, profilesMap))
    .sort((a, b) => {
      const diff = URGENCY_ORDER.indexOf(a.urgency) - URGENCY_ORDER.indexOf(b.urgency);
      if (diff !== 0) return diff;
      if (a.daysRemaining !== null && b.daysRemaining !== null) return a.daysRemaining - b.daysRemaining;
      return 0;
    });
}

export async function getProject(id: string): Promise<ProjectWithUrgency | null> {
  const supabase = await createClient();

  const [{ data: project, error }, profilesMap] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    fetchProfilesMap(supabase),
  ]);

  if (error || !project) return null;
  return mergeProjectWithDev(project, profilesMap);
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
