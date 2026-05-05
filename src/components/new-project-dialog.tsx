"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, AlertCircle } from "lucide-react";
import { addMonths, format } from "date-fns";
import { createProjectAction, type CreateProjectState } from "@/app/(app)/projects/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Profile } from "@/types";

interface NewProjectDialogProps {
  profiles: Profile[];
  currentProfileId: string;
}

const initialState: CreateProjectState = { error: null };

export function NewProjectDialog({ profiles, currentProfileId }: NewProjectDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [hasMaintenance, setHasMaintenance] = useState(false);
  const [state, formAction, isPending] = useActionState(createProjectAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const defaultMaintEnd = format(addMonths(new Date(), 12), "yyyy-MM-dd");

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      formRef.current?.reset();
      setHasMaintenance(false);
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau projet</span>
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouveau projet</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-5 mt-1">
          {/* Projet */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projet</p>

            <Field label="Nom du projet *" htmlFor="name">
              <Input id="name" name="name" placeholder="Boutique Dupont" required />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Statut *" htmlFor="status">
                <NativeSelect id="status" name="status" defaultValue="dev">
                  <option value="dev">En développement</option>
                  <option value="finished">Terminé</option>
                </NativeSelect>
              </Field>
              <Field label="Hébergeur *" htmlFor="hosting">
                <NativeSelect id="hosting" name="hosting" defaultValue="">
                  <option value="" disabled>Choisir…</option>
                  <option value="Vercel">Vercel</option>
                  <option value="Netlify">Netlify</option>
                  <option value="OVH VPS">OVH VPS</option>
                  <option value="OVH Mutualisé">OVH Mutualisé</option>
                  <option value="AWS">AWS</option>
                  <option value="Autre">Autre</option>
                </NativeSelect>
              </Field>
            </div>

            <Field label="Domaine *" htmlFor="domain">
              <Input id="domain" name="domain" placeholder="client.fr" required />
            </Field>

            <Field label="URL Git" htmlFor="git_url">
              <Input id="git_url" name="git_url" placeholder="https://github.com/agence/projet" />
            </Field>

            <Field label="Date de lancement" htmlFor="launch_date">
              <Input id="launch_date" name="launch_date" type="date" />
            </Field>
          </section>

          <Separator />

          {/* Maintenance */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Maintenance</p>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Contrat de maintenance</p>
                <p className="text-xs text-muted-foreground">Activez si un contrat est signé</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={hasMaintenance}
                  onChange={(e) => setHasMaintenance(e.target.checked)}
                />
                <input type="hidden" name="has_maintenance" value={hasMaintenance ? "true" : "false"} />
                <div className="w-10 h-5 bg-muted rounded-full peer peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
              </label>
            </div>

            {hasMaintenance && (
              <Field label="Date de fin de contrat *" htmlFor="maint_end_date">
                <Input
                  id="maint_end_date"
                  name="maint_end_date"
                  type="date"
                  defaultValue={defaultMaintEnd}
                  required
                />
              </Field>
            )}
          </section>

          <Separator />

          {/* Client */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact client</p>

            <Field label="Nom *" htmlFor="client_name">
              <Input id="client_name" name="client_name" placeholder="Marie Dupont" required />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" htmlFor="client_email">
                <Input id="client_email" name="client_email" type="email" placeholder="marie@client.fr" />
              </Field>
              <Field label="Téléphone" htmlFor="client_phone">
                <Input id="client_phone" name="client_phone" placeholder="06 12 34 56 78" />
              </Field>
            </div>
          </section>

          <Separator />

          {/* Équipe */}
          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Équipe</p>

            <Field label="Développeur référent *" htmlFor="dev_id">
              <NativeSelect id="dev_id" name="dev_id" defaultValue={currentProfileId}>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </NativeSelect>
            </Field>

            <Field label="Clockify Project ID" htmlFor="clockify_project_id">
              <Input id="clockify_project_id" name="clockify_project_id" placeholder="64f2a1b3c9e8d00012345678" />
            </Field>
          </section>

          {state.error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {state.error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Création…" : "Créer le projet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  );
}
