"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();
  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-2.5 text-sm focus:border-brand-500";

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6">Create account</h1>
      <form
        className="bg-ink-800 border border-black/10 rounded-xl p-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          if (res.ok) { router.push("/account"); router.refresh(); }
          else setError((await res.json()).error);
        }}
      >
        <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
        <input required type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button className="w-full bg-brand-500 text-ink-900 font-bold rounded-full py-3">Create account</button>
        <p className="text-sm text-stone-500 text-center">Have an account? <Link href="/login" className="text-brand-500">Sign in</Link></p>
      </form>
    </div>
  );
}
