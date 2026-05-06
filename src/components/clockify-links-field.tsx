"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClockifyLink } from "@/types";

interface ClockifyLinksFieldProps {
  defaultValue?: ClockifyLink[];
}

export function ClockifyLinksField({ defaultValue = [] }: ClockifyLinksFieldProps) {
  const [links, setLinks] = useState<ClockifyLink[]>(defaultValue);

  function add() {
    setLinks((prev) => [...prev, { id: "", label: "" }]);
  }

  function remove(index: number) {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  }

  function update(index: number, field: keyof ClockifyLink, value: string) {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  const validLinks = links.filter((l) => l.id.trim());

  return (
    <div className="space-y-2">
      <input type="hidden" name="clockify_projects" value={JSON.stringify(validLinks)} />

      {links.length === 0 && (
        <p className="text-xs text-muted-foreground italic">Aucun forfait lié.</p>
      )}

      {links.map((link, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs">Nom du forfait</Label>
            <Input
              placeholder="ex : Maintenance annuelle"
              value={link.label}
              onChange={(e) => update(i, "label", e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs">Clockify Project ID</Label>
            <Input
              placeholder="64f2a1b3…"
              value={link.id}
              onChange={(e) => update(i, "id", e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-6 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={add}>
        <Plus className="w-3.5 h-3.5" />
        Ajouter un forfait
      </Button>
    </div>
  );
}
