import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Key, Database } from "lucide-react";

export default function IntegrationsSettingsPage() {
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="space-y-4">
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
            <Badge variant={hasSupabase ? "default" : "secondary"} className="text-xs ml-auto">
              {hasSupabase ? "Connecté" : "Non configuré"}
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">Base de données et authentification.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground space-y-1">
            <p>Configuré via les variables d'environnement :</p>
            <code className="block font-mono mt-2">NEXT_PUBLIC_SUPABASE_URL</code>
            <code className="block font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
            <code className="block font-mono">SUPABASE_SERVICE_ROLE_KEY</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
