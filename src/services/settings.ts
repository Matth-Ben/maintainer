import { createClient } from "@/lib/supabase/server";

export async function getSetting(key: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await (supabase.from("settings") as any).select("value").eq("key", key).single();
  return data?.value ?? null;
}

export async function getClockifySettings(): Promise<{ apiKey: string | null; workspaceId: string | null }> {
  const supabase = await createClient();
  const { data } = await (supabase.from("settings") as any)
    .select("key, value")
    .in("key", ["CLOCKIFY_API_KEY", "CLOCKIFY_WORKSPACE_ID"]);

  const map = new Map<string, string>((data ?? []).map((r: { key: string; value: string }) => [r.key, r.value]));
  return {
    apiKey: map.get("CLOCKIFY_API_KEY") ?? null,
    workspaceId: map.get("CLOCKIFY_WORKSPACE_ID") ?? null,
  };
}
