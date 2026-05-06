import { getClockifySettings } from "@/services/settings";
import type { ClockifyProject, ClockifyLink } from "@/types";

const BASE_URL = "https://api.clockify.me/api/v1";

export type ClockifyFetchResult =
  | { status: "ok"; data: ClockifyProject; link: ClockifyLink }
  | { status: "not_configured" }
  | { status: "no_links" }
  | { status: "error"; message: string; link: ClockifyLink };

async function fetchOneProject(
  apiKey: string,
  workspaceId: string,
  link: ClockifyLink
): Promise<ClockifyFetchResult> {
  try {
    const res = await fetch(
      `${BASE_URL}/workspaces/${workspaceId}/projects/${link.id}`,
      {
        headers: { "X-Api-Key": apiKey },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      const msg =
        res.status === 404
          ? `Projet "${link.label}" introuvable sur Clockify (ID invalide ?)`
          : `Erreur API Clockify (${res.status}) pour "${link.label}"`;
      return { status: "error", message: msg, link };
    }

    const raw = await res.json();
    const data: ClockifyProject = {
      id: raw.id,
      name: raw.name,
      estimate: raw.estimate ?? { estimate: "PT0H", type: "AUTO" },
      timeEstimate: raw.timeEstimate ?? {
        estimate: 0,
        type: "AUTO",
        resetOption: null,
        active: false,
        includeNonBillable: true,
      },
      duration: raw.duration ?? "PT0H",
      budgetEstimate: raw.budgetEstimate ?? null,
      hourlyRate: raw.hourlyRate ?? null,
    };

    return { status: "ok", data, link };
  } catch {
    return { status: "error", message: `Impossible de joindre Clockify pour "${link.label}".`, link };
  }
}

export async function getClockifyProjectsData(
  links: ClockifyLink[]
): Promise<ClockifyFetchResult[]> {
  if (!links.length) return [{ status: "no_links" }];

  const { apiKey, workspaceId } = await getClockifySettings();
  if (!apiKey || !workspaceId) return [{ status: "not_configured" }];

  return Promise.all(links.map((link) => fetchOneProject(apiKey, workspaceId, link)));
}
