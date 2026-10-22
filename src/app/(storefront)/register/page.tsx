"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-3 text-sm focus:border-brand-500";

  return (
    <div className="storefront-page storefront-auth">
      <PageIntro eyebrow="Create an Elnaj account" title="Make yourself at home." description="Save your delivery addresses, keep favourite dishes close and find orders placed while signed in. Creating an account is optional — guest ordering is still available." className="page-intro-compact" />
      <form className="storefront-form" onSubmit={async (event) => {
        event.preventDefault();
        if (pending) return;
        setPending(true);
        setError("");
        try {
          const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
          const data = await response.json().catch(() => ({}));
          if (response.ok) { router.push("/account"); router.refresh(); }
          else setError(data.error ?? "We couldn’t create your account. Please try again.");
        } catch {
          setError("We couldn’t connect. Your details are still here — please try again.");
        } finally {
          setPending(false);
        }
      }}>
        <label>Full name<input required disabled={pending} autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={input} /></label>
        <label>Email address<input required disabled={pending} type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={input} /></label>
        <label>Phone number <span className="text-stone-500">(optional)</span><input disabled={pending} type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className={input} /></label>
        <label>Password<input required disabled={pending} type="password" minLength={8} autoComplete="new-password" aria-describedby="password-guidance" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={input} /><span id="password-guidance" className="field-guidance">Use at least 8 characters and a password you don’t use elsewhere.</span></label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <p className="text-xs text-stone-500 leading-relaxed">By creating an account, you agree to our <Link href="/terms" className="underline">terms</Link>. Read how we handle your details in our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
        <button disabled={pending} className="w-full bg-brand-500 text-ink-900 font-bold rounded-full py-3 disabled:opacity-60">{pending ? "Creating your account…" : "Create account"}</button>
      </form>
      <p className="page-note">Already part of Elnaj? <Link href="/login">Sign in</Link>. Just here for a meal? You can <Link href="/checkout">checkout as a guest</Link>.</p>
    </div>
  );
}
