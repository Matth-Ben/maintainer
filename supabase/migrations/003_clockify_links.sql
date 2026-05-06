-- Remplace clockify_project_id (text) par clockify_projects (jsonb array)
-- Structure : [{ "id": "...", "label": "..." }, ...]

alter table public.projects
  add column clockify_projects jsonb not null default '[]'::jsonb;

-- Migrer les données existantes
update public.projects
  set clockify_projects = jsonb_build_array(
    jsonb_build_object('id', clockify_project_id, 'label', 'Principal')
  )
  where clockify_project_id is not null and clockify_project_id <> '';

alter table public.projects drop column clockify_project_id;
