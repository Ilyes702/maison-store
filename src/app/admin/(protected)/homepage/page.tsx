import { AdminHeader } from "@/components/admin/admin-header";
import { HomepageForm } from "@/components/admin/homepage-form";
import { getHomepageContent } from "@/lib/data/settings";

export const metadata = { title: "الصفحة الرئيسية" };

export default async function AdminHomepagePage() {
  const content = await getHomepageContent();
  return (
    <div>
      <AdminHeader title="الصفحة الرئيسية" description="تحكم في محتوى الواجهة الرئيسية للمتجر" />
      <div className="p-6 md:p-8">
        <HomepageForm initial={content} />
      </div>
    </div>
  );
}
