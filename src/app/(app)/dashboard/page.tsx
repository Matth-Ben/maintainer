import { FolderKanban, ShieldAlert, Code2, AlertTriangle, CheckCircle } from "lucide-react";
import { getProjects, getDashboardStats } from "@/services/projects";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCard } from "@/components/stats-card";
import { ProjectCard } from "@/components/project-card";

export default async function DashboardPage() {
  const [stats, projects] = await Promise.all([getDashboardStats(), getProjects()]);
  const priorityProjects = projects.filter((p) => ["expired", "critical", "warning"].includes(p.urgency));
  const otherProjects = projects.filter((p) => !["expired", "critical", "warning"].includes(p.urgency));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Vue d'ensemble de vos projets et contrats de maintenance."
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatsCard label="Total projets" value={stats.total} icon={FolderKanban} iconColor="text-blue-500" />
        <StatsCard label="Maintenus" value={stats.withMaintenance} icon={CheckCircle} iconColor="text-green-500" description="Contrats actifs" />
        <StatsCard label="En dev" value={stats.inDev} icon={Code2} iconColor="text-purple-500" />
        <StatsCard
          label="Urgents"
          value={stats.critical + stats.expired}
          icon={stats.expired > 0 ? ShieldAlert : AlertTriangle}
          iconColor={stats.critical + stats.expired > 0 ? "text-red-500" : "text-muted-foreground"}
          description={stats.expired > 0 ? `dont ${stats.expired} expiré(s)` : undefined}
        />
      </div>

      {priorityProjects.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-red-600 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Maintenance urgente ({priorityProjects.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {priorityProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {priorityProjects.length > 0 ? "Autres projets" : "Tous les projets"}
        </h2>
        {otherProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun projet pour le moment.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
