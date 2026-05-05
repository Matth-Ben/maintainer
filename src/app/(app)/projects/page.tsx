import { Plus } from "lucide-react";
import { getProjects } from "@/services/projects";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ProjectsClient } from "@/components/projects-client";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <PageHeader
        title="Projets"
        description={`${projects.length} projet${projects.length > 1 ? "s" : ""} au total`}
        action={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau projet</span>
          </Button>
        }
      />
      <ProjectsClient projects={projects} />
    </div>
  );
}
