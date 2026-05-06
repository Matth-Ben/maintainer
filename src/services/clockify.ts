import { getClockifySettings } from "@/services/settings";
import type { ClockifyProject } from "@/types";

const BASE_URL = "https://api.clockify.me/api/v1";

export type ClockifyFetchResult =
  | { status: "ok"; data: ClockifyProject }
  | { status: "not_configured" }
  | { status: "not_linked" }
  | { status: "error"; message: string };

export async function getClockifyProjectData(
  clockifyProjectId: string | null
): Promise<ClockifyFetchResult> {
  if (!clockifyProjectId) return { status: "not_linked" };

  const { apiKey, workspaceId } = await getClockifySettings();
  if (!apiKey || !workspaceId) return { status: "not_configured" };

  try {
    const res = await fetch(
      `${BASE_URL}/workspaces/${workspaceId}/projects/${clockifyProjectId}`,
      {
        headers: { "X-Api-Key": apiKey },
        next: { revalidate: 300 }, // cache 5 minutes
      }
    );

    if (!res.ok) {
      if (res.status === 404) return { status: "error", message: "Projet Clockify introuvable. Vérifiez l'ID dans la fiche projet." };
      return { status: "error", message: `Erreur API Clockify (${res.status})` };
    }

    const raw = await res.json();

    const data: ClockifyProject = {
      id: raw.id,
      name: raw.name,
      estimate: raw.estimate ?? { estimate: "PT0H", type: "AUTO" },
      timeEstimate: raw.timeEstimate ?? { estimate: 0, type: "AUTO", resetOption: null, active: false, includeNonBillable: true },
      duration: raw.duration ?? "PT0H",
      budgetEstimate: raw.budgetEstimate ?? null,
      hourlyRate: raw.hourlyRate ?? null,
    };

    return { status: "ok", data };
  } catch {
    return { status: "error", message: "Impossible de joindre l'API Clockify." };
  }
}
