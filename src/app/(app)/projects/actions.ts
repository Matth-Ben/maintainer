"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

const projectSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  status: z.enum(["dev", "finished"]),
  domain: z.string().min(1, "Le domaine est requis"),
  git_url: z.string().optional().default(""),
  hosting: z.string().min(1, "L'hébergeur est requis"),
  launch_date: z.string().optional(),
  has_maintenance: z.boolean(),
  maint_end_date: z.string().optional(),
  client_name: z.string().min(1, "Le nom du contact est requis"),
  client_email: z.string().optional().default(""),
  client_phone: z.string().optional().default(""),
  dev_id: z.string().uuid("Sélectionnez un développeur"),
  clockify_project_id: z.string().optional().default(""),
});

export type CreateProjectState = {
  error: string | null;
  success?: boolean;
};

export async function createProjectAction(
  _: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const raw = {
    name: formData.get("name"),
    status: formData.get("status"),
    domain: formData.get("domain"),
    git_url: formData.get("git_url") || "",
    hosting: formData.get("hosting"),
    launch_date: formData.get("launch_date") || undefined,
    has_maintenance: formData.get("has_maintenance") === "true",
    maint_end_date: formData.get("maint_end_date") || undefined,
    client_name: formData.get("client_name"),
    client_email: formData.get("client_email") || "",
    client_phone: formData.get("client_phone") || "",
    dev_id: formData.get("dev_id"),
    clockify_project_id: formData.get("clockify_project_id") || "",
  };

  const parsed = projectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { client_name, client_email, client_phone, ...rest } = parsed.data;

  const supabase = await createClient();
  const payload: ProjectInsert = {
    name: rest.name,
    status: rest.status,
    domain: rest.domain,
    git_url: rest.git_url,
    hosting: rest.hosting,
    launch_date: rest.launch_date || null,
    has_maintenance: rest.has_maintenance,
    maint_end_date: rest.has_maintenance ? (rest.maint_end_date || null) : null,
    dev_id: rest.dev_id,
    clockify_project_id: rest.clockify_project_id || null,
    client_contact: { name: client_name, email: client_email, phone: client_phone },
  };
  const { error } = await (supabase.from("projects") as any).insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/projects");
  revalidatePath("/dashboard");

  return { error: null, success: true };
}
