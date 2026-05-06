import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, Database } from "lucide-react";
import { getClockifySettings } from "@/services/settings";
import { ClockifySettingsForm } from "@/components/clockify-settings-form";

export default async function IntegrationsSettingsPage() {
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const { apiKey } = await getClockifySettings();
  const isClockifyConnected = !!apiKey;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Key className="w-4 h-4 text-muted-foreground" />
            Clockify
          </CardTitle>
          <CardDescription className="text-xs">
            Clé API pour synchroniser les données de temps et de rentabilité.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClockifySettingsForm isConnected={isClockifyConnected} />
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
