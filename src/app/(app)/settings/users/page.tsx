import { getAllProfiles } from "@/services/profiles";
import { getCurrentProfile } from "@/services/profiles";
import { AddUserDialog } from "@/components/add-user-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, ShieldAlert } from "lucide-react";

export default async function UsersSettingsPage() {
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const [profiles, currentProfile] = await Promise.all([
    getAllProfiles(),
    getCurrentProfile(),
  ]);

  const isAdmin = currentProfile?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted rounded-lg p-4">
        <ShieldAlert className="w-4 h-4 shrink-0" />
        Seul un administrateur peut gérer les utilisateurs.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!hasServiceKey && (
        <div className="flex items-start gap-2 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Variable manquante</p>
            <p className="text-xs mt-0.5">
              Ajoutez <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> dans vos variables d'environnement pour pouvoir créer des utilisateurs.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{profiles.length} utilisateur{profiles.length > 1 ? "s" : ""}</p>
        {hasServiceKey && <AddUserDialog />}
      </div>

      <div className="space-y-2">
        {profiles.map((profile) => {
          const initials = profile.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          const isSelf = profile.id === currentProfile?.id;

          return (
            <Card key={profile.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {profile.full_name}
                        {isSelf && <span className="ml-1.5 text-xs text-muted-foreground">(vous)</span>}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={profile.role === "admin" ? "default" : "secondary"}
                    className="shrink-0 capitalize"
                  >
                    {profile.role}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
