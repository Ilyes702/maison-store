import { ShieldCheck, Truck, Headset, PhoneCall } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "جودة عالية",
    desc: "أقمشة مختارة بعناية وتصنيع متقن لكل قطعة.",
  },
  {
    icon: Truck,
    title: "توصيل سريع",
    desc: "نوصل طلبك إلى جميع المدن المغربية في أسرع وقت.",
  },
  {
    icon: PhoneCall,
    title: "تأكيد عبر الهاتف",
    desc: "نتصل بك لتأكيد الطلب قبل الشحن، بدون أي التزام مسبق.",
  },
  {
    icon: Headset,
    title: "خدمة عملاء",
    desc: "فريقنا جاهز للإجابة على أي استفسار في أي وقت.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-line bg-paper-dim/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-16 md:grid-cols-4 md:px-8">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <item.icon size={22} />
            </div>
            <h3 className="font-display text-base text-ink">{item.title}</h3>
            <p className="text-xs leading-relaxed text-stone">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
