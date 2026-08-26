"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5" dir="rtl">
      <div className="w-full max-w-sm rounded-2xl bg-paper p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Lock size={20} />
          </div>
          <h1 className="font-display text-2xl text-ink">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-stone">سجّل الدخول لإدارة متجرك</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-ink-soft">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-ink"
              dir="ltr"
            />
          </div>

          {error && <p className="rounded-lg bg-sale/10 px-3 py-2 text-sm text-sale">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
