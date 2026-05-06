import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Globe, GitBranch, Server, Calendar, User,
  Mail, Phone, ExternalLink, Clock, Code2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getProject } from "@/services/projects";
import { getAllProfiles } from "@/services/profiles";
import { getClockifyProjectData } from "@/services/clockify";
import { MaintenanceBadge } from "@/components/maintenance-badge";
import { EditProjectDialog } from "@/components/edit-project-dialog";
import { ClockifyWidget } from "@/components/clockify-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [project, profiles] = await Promise.all([getProject(id), getAllProfiles()]);
  const clockify = project ? await getClockifyProjectData(project.clockify_project_id) : { status: "not_linked" as const };

  if (!project) notFound();

  const devInitials = project.dev.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div>
      <div className="mb-5">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour aux projets
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{project.name}</h1>
            {project.status === "dev" && (
              <Badge variant="secondary">
                <Code2 className="w-3 h-3 mr-1" />
                En développement
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            {project.domain}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <MaintenanceBadge urgency={project.urgency} daysRemaining={project.daysRemaining} />
          <EditProjectDialog project={project} profiles={profiles} />
          <a
            href={`https://${project.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ouvrir
          </a>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Informations techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={Globe} label="Domaine" value={project.domain} />
              <Separator />
              <InfoRow icon={Server} label="Hébergement" value={project.hosting} />
              <Separator />
              <InfoRow
                icon={GitBranch}
                label="Repository"
                value={
                  <a href={project.git_url} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1">
                    {project.git_url.replace("https://github.com/", "")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Contact client</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow icon={User} label="Nom" value={project.client_contact.name} />
              <Separator />
              <InfoRow icon={Mail} label="Email"
                value={<a href={`mailto:${project.client_contact.email}`} className="text-primary hover:underline">{project.client_contact.email}</a>} />
              <Separator />
              <InfoRow icon={Phone} label="Téléphone"
                value={<a href={`tel:${project.client_contact.phone}`} className="hover:underline">{project.client_contact.phone}</a>} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Contrat actif</span>
                <Badge variant={project.has_maintenance ? "default" : "secondary"}>
                  {project.has_maintenance ? "Oui" : "Non"}
                </Badge>
              </div>
              {project.launch_date && (
                <>
                  <Separator />
                  <InfoRow icon={Calendar} label="Mise en ligne"
                    value={format(new Date(project.launch_date), "d MMMM yyyy", { locale: fr })} />
                </>
              )}
              {project.maint_end_date && (
                <>
                  <Separator />
                  <InfoRow icon={Clock} label="Fin contrat"
                    value={
                      <span className="flex items-center gap-2">
                        {format(new Date(project.maint_end_date), "d MMMM yyyy", { locale: fr })}
                        <MaintenanceBadge urgency={project.urgency} daysRemaining={project.daysRemaining} />
                      </span>
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {clockify.status === "ok" ? (
            <ClockifyWidget data={clockify.data} />
          ) : (
            <Card>
              <CardContent className="p-5 text-center">
                <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                {clockify.status === "not_linked" && (
                  <>
                    <p className="text-sm text-muted-foreground">Aucun projet Clockify lié</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Ajoutez un Clockify ID dans "Modifier"</p>
                  </>
                )}
                {clockify.status === "not_configured" && (
                  <>
                    <p className="text-sm text-muted-foreground">Clockify non configuré</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Renseignez vos clés dans Paramètres → Intégrations</p>
                  </>
                )}
                {clockify.status === "error" && (
                  <>
                    <p className="text-sm text-muted-foreground">Erreur Clockify</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{clockify.message}</p>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Développeur référent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                    {devInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{project.dev.full_name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{project.dev.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center gap-2 w-32 shrink-0">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex-1 text-sm font-medium min-w-0 break-words">{value}</div>
    </div>
  );
}
