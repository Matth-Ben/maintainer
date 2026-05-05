import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            Alertes de maintenance
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
  );
}
