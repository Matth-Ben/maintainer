"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { UserPlus, AlertCircle } from "lucide-react";
import { createUserAction, type CreateUserState } from "@/app/(app)/settings/users/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CreateUserState = { error: null };

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createUserAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Ajouter un utilisateur</span>
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvel utilisateur</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <Label htmlFor="full_name" className="text-xs">Nom complet *</Label>
            <Input id="full_name" name="full_name" placeholder="Julie Mercier" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">Email *</Label>
            <Input id="email" name="email" type="email" placeholder="julie@agence.fr" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs">Mot de passe temporaire *</Label>
            <Input id="password" name="password" type="password" placeholder="8 caractères min." required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs">Rôle *</Label>
            <select
              id="role"
              name="role"
              defaultValue="user"
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Admin</option>
            </select>
          </div>

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
              {isPending ? "Création…" : "Créer l'utilisateur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
