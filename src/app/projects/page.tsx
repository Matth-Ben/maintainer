"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { getMockProjectsWithUrgency } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectCard } from "@/components/project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceUrgency } from "@/types";

type FilterStatus = "all" | "maintenance" | "dev" | "critical" | "no-maintenance";

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "maintenance", label: "Maintenus" },
  { value: "critical", label: "Urgents" },
  { value: "dev", label: "En dev" },
  { value: "no-maintenance", label: "Sans contrat" },
];

export default function ProjectsPage() {
  const allProjects = getMockProjectsWithUrgency();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.domain.toLowerCase().includes(search.toLowerCase()) ||
        p.client_contact.name.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "maintenance" && p.has_maintenance) ||
        (activeFilter === "dev" && p.status === "dev") ||
        (activeFilter === "critical" && ["expired", "critical", "warning"].includes(p.urgency)) ||
        (activeFilter === "no-maintenance" && !p.has_maintenance);

      return matchSearch && matchFilter;
    });
  }, [allProjects, search, activeFilter]);

  return (
    <div>
      <PageHeader
        title="Projets"
        description={`${allProjects.length} projets au total`}
        action={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau projet</span>
          </Button>
        }
      />

      <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un projet, domaine, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                activeFilter === value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm text-muted-foreground">Aucun projet trouvé.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
