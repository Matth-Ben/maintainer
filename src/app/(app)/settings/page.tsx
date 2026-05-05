import { getCurrentProfile } from "@/services/profiles";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Key, Database, Bell, User } from "lucide-react";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  return (
    <div>
      <PageHeader title="Paramètres" description="Configuration de l'application et des intégrations." />

      <div className="space-y-4 max-w-2xl">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Profil
            </CardTitle>
            <CardDescription className="text-xs">Vos informations personnelles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name" className="text-xs">Nom complet</Label>
              <Input id="full_name" defaultValue={profile?.full_name ?? ""} />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Rôle</Label>
              <Badge variant="secondary" className="w-fit capitalize">{profile?.role ?? "—"}</Badge>
            </div>
            <Button size="sm" disabled>Enregistrer</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              Clockify
              <Badge variant="secondary" className="text-xs ml-auto">Non configuré</Badge>
            </CardTitle>
            <CardDescription className="text-xs">
              Clé API pour synchroniser les données de temps et de rentabilité.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="clockify_key" className="text-xs">X-Api-Key</Label>
              <Input id="clockify_key" type="password" placeholder="••••••••••••••••••••••" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workspace_id" className="text-xs">Workspace ID</Label>
              <Input id="workspace_id" placeholder="ex: 64f2a1b3c9e8d00012345678" />
            </div>
            <Button size="sm" disabled>Connecter Clockify</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              Supabase
              <Badge variant="default" className="text-xs ml-auto">Connecté</Badge>
            </CardTitle>
            <CardDescription className="text-xs">Base de données et authentification.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground space-y-1">
              <p>Configuré via les variables d'environnement :</p>
              <code className="block font-mono mt-2">NEXT_PUBLIC_SUPABASE_URL</code>
              <code className="block font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="w-4 h-4 text-muted-foreground" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground space-y-2">
              <p>Alertes automatiques via Edge Function Supabase (cron quotidien) :</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li><strong>J-30</strong> — Rappel anticipé</li>
                <li><strong>J-15</strong> — Alerte standard</li>
                <li><strong>J-7</strong> — Alerte urgente</li>
              </ul>
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="webhook_url" className="text-xs">Webhook Slack / Discord</Label>
              <Input id="webhook_url" placeholder="https://hooks.slack.com/..." disabled />
            </div>
            <Button size="sm" disabled>Configurer</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
