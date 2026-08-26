import type { Metadata } from "next";
import "@fontsource/tajawal/300.css";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/tajawal/900.css";
import "@fontsource/el-messiri/500.css";
import "@fontsource/el-messiri/600.css";
import "@fontsource/el-messiri/700.css";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/context/toast-context";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "MAISON — أزياء عصرية تعكس شخصيتك",
    template: "%s | MAISON",
  },
  description:
    "متجر أزياء مغربي حديث، قطع مختارة بعناية وجودة عالية، توصيل لجميع المدن مع الدفع عند الاستلام.",
  openGraph: {
    title: "MAISON — أزياء عصرية تعكس شخصيتك",
    description: "قطع مختارة بعناية، جودة عالية، وتوصيل سريع لجميع المدن.",
    locale: "ar_MA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
