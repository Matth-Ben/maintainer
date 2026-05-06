"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const clockifySchema = z.object({
  api_key: z.string().min(1, "La clé API est requise"),
  workspace_id: z.string().min(1, "Le Workspace ID est requis"),
});

export type ClockifyState = { error: string | null; success?: boolean };

export async function saveClockifyAction(_: ClockifyState, formData: FormData): Promise<ClockifyState> {
  const parsed = clockifySchema.safeParse({
    api_key: formData.get("api_key"),
    workspace_id: formData.get("workspace_id"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { api_key, workspace_id } = parsed.data;

  // Valider les credentials en appelant l'API Clockify
  try {
    const res = await fetch(`https://api.clockify.me/api/v1/workspaces/${workspace_id}/projects?limit=1`, {
      headers: { "X-Api-Key": api_key },
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      if (res.status === 401) return { error: "Clé API invalide. Vérifiez votre X-Api-Key." };
      if (res.status === 403) return { error: "Workspace ID invalide ou accès refusé." };
      return { error: `Erreur Clockify (${res.status}). Vérifiez vos informations.` };
    }
  } catch {
    return { error: "Impossible de joindre l'API Clockify. Vérifiez votre connexion." };
  }

  // Sauvegarder dans Supabase via upsert
  const supabase = createAdminClient();
  const { error } = await (supabase.from("settings") as any).upsert([
    { key: "CLOCKIFY_API_KEY", value: api_key },
    { key: "CLOCKIFY_WORKSPACE_ID", value: workspace_id },
  ]);

  if (error) return { error: error.message };

  revalidatePath("/settings/integrations");
  return { error: null, success: true };
}

export async function disconnectClockifyAction(): Promise<{ error: string | null }> {
  const supabase = createAdminClient();
  const { error } = await (supabase.from("settings") as any)
    .delete()
    .in("key", ["CLOCKIFY_API_KEY", "CLOCKIFY_WORKSPACE_ID"]);

  if (error) return { error: error.message };
  revalidatePath("/settings/integrations");
  return { error: null };
}
