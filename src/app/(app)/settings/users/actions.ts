"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const createUserSchema = z.object({
  full_name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  role: z.enum(["admin", "user"]),
});

export type CreateUserState = { error: string | null; success?: boolean };

export async function createUserAction(
  _: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const parsed = createUserSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { full_name, email, password, role } = parsed.data;

  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (error) return { error: error.message };

    // Le trigger crée le profil en 'user' par défaut, on passe en admin si besoin
    if (role === "admin" && data.user) {
      await (supabase.from("profiles") as any).update({ role: "admin" }).eq("id", data.user.id);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return { error: msg };
  }

  revalidatePath("/settings/users");
  return { error: null, success: true };
}

export async function deleteUserAction(userId: string): Promise<{ error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return { error: error.message };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return { error: msg };
  }

  revalidatePath("/settings/users");
  return { error: null };
}
