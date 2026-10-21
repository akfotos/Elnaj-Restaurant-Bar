"use client";

import { useState } from "react";
import Link from "next/link";
import DiningHero from "@/components/DiningHero";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "General", message: "" });
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-2.5 text-sm focus:border-brand-500";

  return (
    <div className="dining-editorial">
      <DiningHero eyebrow="Contact & enquiries" title="A question. An idea." accent="Let’s talk." description="From choosing your next dish to help with an order, start a conversation with Elnaj." image="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1600&q=85" imageAlt="Cocktails with fresh citrus garnishes" />
      <div className="dining-container contact-layout">
        <aside><p className="dining-eyebrow">We’re here to help</p><h2>A little guidance.<br /><em>A personal touch.</em></h2><p className="dining-copy">Have a question about ingredients, an order or a special request? Tell us a little about what you need.</p><div className="contact-shortcuts"><Link href="/track"><span>Already ordered?</span>Track your order ↗</Link><Link href="/faq"><span>Good to know</span>Delivery &amp; pickup FAQs ↗</Link><Link href="/terms"><span>Before you order</span>Terms &amp; policies ↗</Link></div><p className="contact-disclaimer">This is an enquiry form, not a table-booking service. Sending a message does not confirm a reservation or special request.</p></aside>
        <section className="contact-form-panel" aria-labelledby="contact-form-title">
          <p className="dining-eyebrow">Get in touch</p><h2 id="contact-form-title">Start a conversation.</h2><p className="dining-copy">For an existing order, please include your order number in your message.</p>
          {sent ? (
            <div role="status" className="contact-success"><h3>Thank you for reaching out.</h3><p>Your message has been sent. Our team will reply using the email address you provided.</p><button type="button" className="dining-text-link" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "General", message: "" }); }}>Send another message ↗</button></div>
          ) : (
            <form className="space-y-5 mt-7" onSubmit={async (event) => {
              event.preventDefault();
              if (pending) return;
              setPending(true);
              setError("");
              try {
                const res = await fetch("/api/support", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
                if (!res.ok) throw new Error("Unable to send");
                setSent(true);
              } catch {
                setError("We couldn’t send your message. Please try again. Your message is still here.");
              } finally {
                setPending(false);
              }
            }}>
              <div className="contact-fields"><label>Your name<input required autoComplete="name" maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={input} /></label><label>Email address<input required type="email" autoComplete="email" maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={input} /></label></div>
              <label className="block">How can we help?<select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className={input}><option>General</option><option>Order issue</option><option>Refund request</option><option>Dietary enquiry</option><option>Special occasion enquiry</option><option>Feedback</option></select></label>
              <label className="block">Your message<textarea required minLength={5} maxLength={5000} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className={`${input} h-40`} /></label>
              <p className="text-xs text-stone-500">Your details are used to respond to this enquiry. Read our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              <button disabled={pending} className="dining-button dining-button-burgundy disabled:opacity-60">{pending ? "Sending…" : "Send your message"} <span aria-hidden="true">↗</span></button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
