"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Sign-in failed");
    if (data.role === "CUSTOMER") return setError("This account does not have staff access");
    router.push(params.get("redirectedFrom") ?? "/admin");
    router.refresh();
  };

  const input =
    "w-full bg-[#1f1a17] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

  return (
    <form onSubmit={submit} className="w-full max-w-sm bg-[#1a1614] border border-white/10 rounded-2xl p-8 space-y-4">
      <div className="text-center">
        <p className="text-xl font-bold"><span className="text-brand-500">Elnaj</span> Staff</p>
        <p className="text-sm text-stone-500 mt-1">Sign in to the operations dashboard</p>
      </div>
      {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
      <label className="block">
        <span className="text-xs text-stone-400">Email</span>
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} autoComplete="email" />
      </label>
      <label className="block">
        <span className="text-xs text-stone-400">Password</span>
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} autoComplete="current-password" />
      </label>
      <button disabled={loading} className="w-full bg-brand-500 disabled:opacity-50 text-white font-bold rounded-lg py-2.5 hover:bg-brand-600 transition">
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-xs text-stone-500 text-center">Staff accounts only. Customers should use the main sign-in.</p>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-dark min-h-screen bg-[#12100e] text-stone-200 flex items-center justify-center px-4">
      <Suspense>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
