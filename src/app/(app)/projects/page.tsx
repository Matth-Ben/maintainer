import { getProjects } from "@/services/projects";
import { getAllProfiles, getCurrentProfile } from "@/services/profiles";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectsClient } from "@/components/projects-client";
import { NewProjectDialog } from "@/components/new-project-dialog";

export default async function ProjectsPage() {
  const [projects, profiles, currentProfile] = await Promise.all([
    getProjects(),
    getAllProfiles(),
    getCurrentProfile(),
  ]);

  return (
    <div>
      <PageHeader
        title="Projets"
        description={`${projects.length} projet${projects.length > 1 ? "s" : ""} au total`}
        action={
          <NewProjectDialog
            profiles={profiles}
            currentProfileId={currentProfile?.id ?? ""}
          />
        }
      />
      <ProjectsClient projects={projects} />
    </div>
  );
}
