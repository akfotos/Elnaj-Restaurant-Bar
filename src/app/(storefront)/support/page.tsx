"use client";

import { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const [sent, setSent] = useState(false);
  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-2.5 text-sm focus:border-brand-500";

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-2">Contact us</h1>
      <p className="text-sm text-stone-500 mb-6">Order issue, refund request or feedback — we reply within 24h.</p>
      {sent ? (
        <p className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-700">Message sent. We&apos;ll get back to you soon.</p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (res.ok) setSent(true);
          }}
        >
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
          <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={input}>
            <option>General</option><option>Order issue</option><option>Refund request</option><option>Feedback</option>
          </select>
          <textarea required placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${input} h-28`} />
          <button className="w-full bg-brand-500 text-ink-900 font-bold rounded-full py-3">Send</button>
        </form>
      )}
    </div>
  );
}
