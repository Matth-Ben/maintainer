import { getCurrentProfile } from "@/services/profiles";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default async function ProfileSettingsPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Informations personnelles
          </CardTitle>
          <CardDescription className="text-xs">
            Votre nom affiché dans l'application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name" className="text-xs">Nom complet</Label>
            <Input id="full_name" defaultValue={profile?.full_name ?? ""} />
          </div>
          <div className="grid gap-2">
            <Label className="text-xs">Rôle</Label>
            <Badge variant="secondary" className="w-fit capitalize">
              {profile?.role ?? "—"}
            </Badge>
          </div>
          <Button size="sm" disabled>Enregistrer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
