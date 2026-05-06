-- Table pour stocker les paramètres globaux de l'application
create table if not exists public.settings (
  key   text primary key,
  value text not null
);

alter table public.settings enable row level security;

-- Tous les utilisateurs authentifiés peuvent lire les settings
create policy "Authenticated users can read settings"
  on public.settings for select
  to authenticated
  using (true);

-- Seuls les admins peuvent modifier les settings
create policy "Admins can manage settings"
  on public.settings for all
  to authenticated
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  )
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );
