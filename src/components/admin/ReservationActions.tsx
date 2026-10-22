"use client";

import { useState, useTransition } from "react";
import { updateReservationStatus } from "@/lib/admin-actions";
import { RESERVATION_STATUSES } from "@/lib/format";

export default function ReservationActions({ id, currentStatus, isPast }: { id: string; currentStatus: string; isPast: boolean }) {
  const [status, setStatus] = useState(currentStatus);
  const [contacted, setContacted] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <form className="mt-5 space-y-3 border-t border-white/10 pt-4" onSubmit={(event) => {
      event.preventDefault();
      setError("");
      start(async () => {
        try {
          await updateReservationStatus({ id, status, currentStatus, guestContacted: contacted });
        } catch {
          setError("Couldn’t update the request. Refresh and try again. Past visits cannot be confirmed.");
        }
      });
    }}>
      <label className="block text-xs text-stone-400">Request status<select disabled={pending} value={status} onChange={(event) => { setStatus(event.target.value); setContacted(false); }} className="block mt-2 bg-ink-700 border border-white/10 rounded-lg px-3 py-2 text-sm text-stone-700">{RESERVATION_STATUSES.map((value) => <option key={value} value={value} disabled={value === "CONFIRMED" && isPast}>{value.charAt(0) + value.slice(1).toLowerCase()}</option>)}</select></label>
      {status !== "PENDING" && <label className="flex items-start gap-2 text-xs text-stone-400"><input type="checkbox" checked={contacted} disabled={pending} onChange={(event) => setContacted(event.target.checked)} className="mt-0.5" /><span>I have contacted the guest about this decision. Saving does not send an email or SMS.</span></label>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button disabled={pending || status === currentStatus || (status !== "PENDING" && !contacted)} className="text-xs rounded-full border border-brand-500 text-brand-500 px-4 py-2 disabled:opacity-40">{pending ? "Saving…" : "Save status"}</button>
    </form>
  );
}
