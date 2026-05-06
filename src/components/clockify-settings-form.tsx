"use client";

import { useActionState, useEffect } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { saveClockifyAction, disconnectClockifyAction, type ClockifyState } from "@/app/(app)/settings/integrations/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ClockifySettingsFormProps {
  isConnected: boolean;
}

const initialState: ClockifyState = { error: null };

export function ClockifySettingsForm({ isConnected }: ClockifySettingsFormProps) {
  const [state, formAction, isPending] = useActionState(saveClockifyAction, initialState);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
          {isConnected ? "Connecté" : "Non configuré"}
        </Badge>
      </div>

      <form action={formAction} className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="api_key" className="text-xs">X-Api-Key *</Label>
          <Input
            id="api_key"
            name="api_key"
            type="password"
            placeholder="••••••••••••••••••••••"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="workspace_id" className="text-xs">Workspace ID *</Label>
          <Input
            id="workspace_id"
            name="workspace_id"
            placeholder="ex: 64f2a1b3c9e8d00012345678"
            required
          />
        </div>

        {state.error && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {state.error}
          </div>
        )}

        {state.success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 px-3 py-2 rounded-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Clockify connecté avec succès.
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Vérification…" : "Connecter Clockify"}
          </Button>
          {isConnected && (
            <form action={disconnectClockifyAction}>
              <Button type="submit" size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                Déconnecter
              </Button>
            </form>
          )}
        </div>
      </form>
    </div>
  );
}
