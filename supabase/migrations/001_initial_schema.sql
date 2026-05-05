-- ============================================================
-- Migration 001 : Schéma initial Maintainer
-- À coller dans Supabase > SQL Editor > New query
-- ============================================================

-- Types énumérés
CREATE TYPE public.user_role AS ENUM ('admin', 'user');
CREATE TYPE public.project_status AS ENUM ('dev', 'finished');

-- ============================================================
-- Table : profiles
-- Liée à auth.users (créée automatiquement via trigger)
-- ============================================================
CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        public.user_role NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Tout utilisateur connecté peut lire les profils
CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Un utilisateur peut mettre à jour son propre profil
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- ============================================================
-- Table : projects
-- ============================================================
CREATE TABLE public.projects (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT NOT NULL,
  status               public.project_status NOT NULL DEFAULT 'dev',
  launch_date          DATE,
  has_maintenance      BOOLEAN NOT NULL DEFAULT FALSE,
  maint_end_date       DATE,
  git_url              TEXT NOT NULL DEFAULT '',
  hosting              TEXT NOT NULL DEFAULT '',
  domain               TEXT NOT NULL DEFAULT '',
  client_contact       JSONB NOT NULL DEFAULT '{"name":"","email":"","phone":""}',
  dev_id               UUID NOT NULL REFERENCES public.profiles(id),
  clockify_project_id  TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Lecture : tout utilisateur connecté
CREATE POLICY "projects_select"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

-- Création : tout utilisateur connecté
CREATE POLICY "projects_insert"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Modification : tout utilisateur connecté
CREATE POLICY "projects_update"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true);

-- Suppression : admin uniquement
CREATE POLICY "projects_delete_admin"
  ON public.projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Trigger : création automatique du profil à l'inscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- APRÈS AVOIR CRÉÉ TON PREMIER UTILISATEUR dans Supabase Auth,
-- passe-le en admin manuellement :
--
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'ton-user-uuid';
-- ============================================================
