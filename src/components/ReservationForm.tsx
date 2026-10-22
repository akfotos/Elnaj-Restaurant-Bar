"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const initial = { name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "", website: "" };

export default function ReservationForm() {
  const [form, setForm] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [today, setToday] = useState("");
  const requestId = useRef<string | null>(null);
  const receipt = useRef<HTMLDivElement>(null);
  const input = "w-full bg-ink-800 border border-black/10 rounded-lg px-3 py-3 text-sm focus:border-brand-500";

  useEffect(() => { setToday(new Date().toISOString().slice(0, 10)); }, []);
  useEffect(() => { if (reference) receipt.current?.focus(); }, [reference]);

  const update = (key: keyof typeof initial, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    requestId.current = null;
  };

  if (reference) return (
    <div ref={receipt} role="status" tabIndex={-1} className="reservation-receipt">
      <p className="dining-eyebrow">Request received</p><h2>Thank you, {form.name.trim()}.</h2>
      <p className="dining-copy">Your request has been saved for our team to review. Your table is <strong>not confirmed</strong> until a member of staff contacts you and confirms availability.</p>
      <dl><div><dt>Preferred visit</dt><dd>{form.date} at {form.time} (Accra, GMT)</dd></div><div><dt>Party size</dt><dd>{form.guests} guests</dd></div><div><dt>Reference</dt><dd>{reference}</dd></div></dl>
      <p className="dining-copy">Keep this reference if you need to discuss or change your request. No automatic confirmation email has been sent.</p>
      <Link href="/support" className="dining-text-link">Contact our team <span aria-hidden="true">↗</span></Link>
    </div>
  );

  return (
    <form className="reservation-form" onSubmit={async (event) => {
      event.preventDefault();
      if (pending) return;
      setPending(true);
      setError("");
      try {
        requestId.current ??= crypto.randomUUID();
        const response = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, guests: Number(form.guests), requestId: requestId.current }) });
        const data = await response.json();
        if (!response.ok || typeof data.reference !== "string") {
          setError(typeof data.error === "string" ? data.error : "We couldn’t save your request. Please try again.");
          return;
        }
        setReference(data.reference);
      } catch {
        setError("We couldn’t send your request. Your details are still here — please try again.");
      } finally {
        setPending(false);
      }
    }}>
      <fieldset disabled={pending} className="reservation-fields">
        <legend className="sr-only">Reservation request details</legend>
        <div className="reservation-visit-fields">
          <label>Preferred date<input type="date" required min={today || undefined} value={form.date} onChange={(event) => update("date", event.target.value)} className={input} /></label>
          <label>Preferred time (GMT)<input type="time" required value={form.time} onChange={(event) => update("time", event.target.value)} className={input} /></label>
          <label>Number of guests<input type="number" required min={1} max={99} step={1} value={form.guests} onChange={(event) => update("guests", event.target.value)} className={input} /></label>
        </div>
        <label>Your name<input required minLength={2} maxLength={120} autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} className={input} /></label>
        <div className="contact-fields">
          <label>Email address<input type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={input} /></label>
          <label>Phone number<input type="tel" required minLength={7} maxLength={32} autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={input} /></label>
        </div>
        <label>Anything we should know? <span className="text-stone-500">(optional)</span><textarea rows={4} maxLength={2000} placeholder="Dietary needs, accessibility requirements or a special occasion" value={form.notes} onChange={(event) => update("notes", event.target.value)} className={input} /></label>
        <div className="reservation-trap" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></label></div>
        <label className="reservation-acknowledgement"><input type="checkbox" required /><span>I understand this is a request, not a confirmed booking. All dates, times and party sizes are subject to staff approval.</span></label>
        <p className="text-xs text-stone-500 leading-relaxed">We use your contact details to respond to this request. Read our <Link href="/privacy" className="underline">privacy policy</Link>. All times are in Accra local time (GMT).</p>
        {error && <p role="alert" className="text-sm text-brand-500">{error}</p>}
        <button type="submit" className="dining-button dining-button-burgundy disabled:opacity-60">{pending ? "Sending request…" : "Request a table"} <span aria-hidden="true">↗</span></button>
        <span role="status" className="sr-only">{pending ? "Saving your reservation request" : ""}</span>
      </fieldset>
    </form>
  );
}
