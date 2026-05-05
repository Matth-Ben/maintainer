import { PageHeader } from "@/components/layout/page-header";
import { SettingsTabs } from "@/components/settings-tabs";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Paramètres"
        description="Configuration de l'application et des intégrations."
      />
      <SettingsTabs />
      {children}
    </div>
  );
}
