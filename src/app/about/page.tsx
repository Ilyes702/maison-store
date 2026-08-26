import { SiteShell } from "@/components/layout/site-shell";
import { getSettings } from "@/lib/data/settings";

export const metadata = { title: "من نحن" };

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <h1 className="font-display text-4xl text-ink mb-6">من نحن</h1>
        <p className="leading-relaxed text-ink-soft">
          {settings.storeName} هو متجر أزياء مغربي يؤمن بأن الأناقة لا تحتاج إلى تعقيد.
          نختار كل قطعة بعناية من حيث الجودة والقصّة والراحة، لنقدم لك خزانة ملابس
          تعكس شخصيتك دون أي مجهود إضافي. نعمل يومياً على تقريب أحدث صيحات الموضة
          العالمية إلى السوق المغربي، بأسعار عادلة وخدمة تضعك أنت في المقام الأول.
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          نؤمن بالتواصل المباشر: بعد كل طلب، يتصل بك فريقنا لتأكيد التفاصيل قبل
          الشحن، لأن رضاك هو مقياس نجاحنا الحقيقي.
        </p>
      </div>
    </SiteShell>
  );
}
