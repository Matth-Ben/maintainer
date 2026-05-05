# Architecture Système : Maintenance Manager

## 1. Stack Technique
- **Framework :** Next.js 14+ (App Router)
- **Auth & DB :** Supabase (PostgreSQL + Auth + RLS)
- **Style :** Tailwind CSS + Shadcn/UI (pour la rapidité et cohérence)
- **State Management :** TanStack Query (React Query) pour le cache et la synchro API
- **Dates :** date-fns

## 2. Schéma de Données (Supabase)
### Table `profiles` (Gestion Utilisateurs)
- `id` (uuid, PK) -> references auth.users
- `full_name` (text)
- `role` (enum: 'admin', 'user')

### Table `projects`
- `id` (uuid, PK)
- `name` (text)
- `status` (enum: 'dev', 'finished')
- `launch_date` (date, nullable)
- `has_maintenance` (boolean)
- `maint_end_date` (date, calculée à +12 mois par défaut)
- `git_url`, `hosting`, `domain` (text)
- `client_contact` (jsonb: {name, email, phone})
- `dev_id` (uuid) -> references profiles
- `clockify_project_id` (text, nullable)

## 3. Sécurité (RLS)
- Désactiver l'inscription publique dans Supabase Auth.
- Politique : `auth.role() == 'authenticated'` requis pour toute lecture/écriture.
- Seul le rôle 'admin' peut insérer/supprimer dans la table `profiles`.

## 4. Logique de Rappel (Maintenance)
- Création d'une **Edge Function** Supabase qui tourne une fois par jour (Cron).
- Si `maint_end_date` approche (J-30, J-15, J-7), envoi d'une notification via Email (Resend) ou Webhook Slack/Discord.