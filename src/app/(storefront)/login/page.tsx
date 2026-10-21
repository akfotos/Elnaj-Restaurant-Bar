"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function OAuthError({ setError }: { setError: (e: string) => void }) {
  const sp = useSearchParams();
  const provider = sp.get("oauth_error");
  useEffect(() => {
    if (provider) setError(`Sign in with ${provider === "google" ? "Google" : "Apple"} is unavailable or was cancelled.`);
  }, [provider, setError]);
  return null;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.87c2.27-2.09 3.58-5.17 3.58-8.81z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z"/>
      <path fill="#FBBC05" d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l4-3.1z"/>
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l4 3.1C6.23 6.88 8.88 4.77 12 4.77z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M17.05 12.54c-.03-2.9 2.37-4.29 2.48-4.36-1.35-1.98-3.46-2.25-4.21-2.28-1.79-.18-3.5 1.05-4.4 1.05-.91 0-2.31-1.03-3.8-1-1.96.03-3.76 1.14-4.77 2.88-2.03 3.53-.52 8.75 1.46 11.61.97 1.4 2.12 2.97 3.63 2.91 1.46-.06 2.01-.94 3.77-.94s2.26.94 3.8.91c1.57-.03 2.57-1.42 3.53-2.83 1.11-1.62 1.57-3.19 1.6-3.27-.04-.02-3.06-1.18-3.09-4.67zM14.16 4.06c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.74-.74.85-1.39 2.23-1.22 3.54 1.29.1 2.6-.65 3.41-1.62z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const input =
    "w-full bg-ink-800 border border-black/10 rounded-xl px-4 py-3 text-sm placeholder:text-stone-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition";

  return (
    <div className="min-h-[calc(100vh-120px)] grid lg:grid-cols-2 bg-ink-900">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#800020] to-[#4a0012] p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-72 h-72 bg-black/10 rounded-full blur-3xl" />
        <Link href="/" className="text-2xl font-bold text-white relative">
          Elnaj Restaurant &amp; Bar
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-bold text-white leading-tight">Good food is<br />just a sign-in away.</h2>
          <p className="mt-4 text-white/70 max-w-sm">
            Track orders in real time, save your favorite dishes, and checkout in seconds.
          </p>
          <div className="mt-8 flex gap-6 text-sm text-white/70">
            <span>🛵 Fast delivery</span>
            <span>🔒 Secure checkout</span>
            <span>⭐ Member rewards</span>
          </div>
        </div>
        <p className="text-xs text-white/50 relative">© Elnaj Restaurant &amp; Bar</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Suspense>
            <OAuthError setError={setError} />
          </Suspense>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-stone-500 mt-1 mb-8">Sign in to your account to continue</p>

          <div className="space-y-3">
            <a
              href="/api/auth/oauth/google"
              className="w-full flex items-center justify-center gap-3 bg-ink-800 border border-black/10 rounded-xl py-3 text-sm font-medium hover:border-brand-500/40 transition shadow-sm"
            >
              <GoogleIcon /> Continue with Google
            </a>
            <a
              href="/api/auth/oauth/apple"
              className="w-full flex items-center justify-center gap-3 bg-[#000] rounded-xl py-3 text-sm font-medium text-[#fff] hover:opacity-85 transition"
            >
              <AppleIcon /> Continue with Apple
            </a>
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-xs text-stone-400 uppercase tracking-wide">or with email</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              setError("");
              const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
              });
              setLoading(false);
              if (res.ok) {
                router.push("/account");
                router.refresh();
              } else setError((await res.json()).error);
            }}
          >
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Email</label>
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Password</label>
              <input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} />
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button disabled={loading} className="w-full bg-brand-500 disabled:opacity-60 text-ink-900 font-bold rounded-xl py-3 hover:bg-brand-600 transition">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-stone-500 text-center mt-8">
            New here?{" "}
            <Link href="/register" className="text-brand-600 font-medium hover:underline">Create an account</Link>
            {" "}or{" "}
            <Link href="/checkout" className="text-brand-600 font-medium hover:underline">checkout as guest</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
