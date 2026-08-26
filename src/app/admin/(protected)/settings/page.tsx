import { AdminHeader } from "@/components/admin/admin-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export const metadata = { title: "الإعدادات" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <AdminHeader title="الإعدادات" description="تحكم في معلومات متجرك ووسائل التواصل" />
      <div className="p-6 md:p-8">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}


