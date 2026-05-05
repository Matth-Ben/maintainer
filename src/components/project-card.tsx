"use client";

import Link from "next/link";
import { Globe, GitBranch, Server, ChevronRight, Code2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MaintenanceBadge } from "@/components/maintenance-badge";
import type { ProjectWithUrgency } from "@/types";

interface ProjectCardProps {
  project: ProjectWithUrgency;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const initials = project.dev.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card className="transition-all group-hover:shadow-md group-hover:border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                {project.status === "dev" && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    <Code2 className="w-3 h-3 mr-1" />
                    En dev
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                <Globe className="w-3 h-3 shrink-0" />
                {project.domain}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
          </div>

          <div className="mt-3">
            <MaintenanceBadge urgency={project.urgency} daysRemaining={project.daysRemaining} />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 min-w-0">
                <Server className="w-3 h-3 shrink-0" />
                <span className="truncate">{project.hosting}</span>
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 shrink-0" />
                Git
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{project.dev.full_name.split(" ")[0]}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
