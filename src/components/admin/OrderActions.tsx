"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus, refundOrder } from "@/lib/admin-actions";

export default function OrderActions({ orderId, currentStatus, statuses, paymentStatus, total }: {
  orderId: string; currentStatus: string; statuses: string[]; paymentStatus: string; total: number;
}) {
  const [note, setNote] = useState("");
  const [refundAmt, setRefundAmt] = useState("");
  const [pending, start] = useTransition();

  return (
    <section className="bg-ink-800 border border-black/10 rounded-xl p-5 space-y-4">
      <h2 className="font-semibold">Actions</h2>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            disabled={pending || s === currentStatus}
            onClick={() => start(() => updateOrderStatus(orderId, s as never, note || undefined))}
            className={`text-xs rounded-full px-3 py-1.5 border ${s === currentStatus ? "border-brand-500 text-brand-500" : "border-black/15 hover:border-brand-500"}`}
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Status note (optional, e.g. driver assigned)" className="w-full bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm" />
      {(paymentStatus === "PAID" || paymentStatus === "PARTIALLY_REFUNDED") && (
        <div className="flex items-center gap-3 pt-2 border-t border-black/10">
          <input value={refundAmt} onChange={(e) => setRefundAmt(e.target.value)} placeholder={`Refund amount (max ${total})`} type="number" className="bg-ink-700 border border-black/10 rounded-lg px-3 py-2 text-sm w-56" />
          <button
            disabled={pending}
            onClick={() => start(() => refundOrder(orderId, refundAmt ? +refundAmt : undefined))}
            className="text-sm border border-red-500 text-red-400 rounded-lg px-4 py-2 hover:bg-red-500/10"
          >
            Issue refund
          </button>
        </div>
      )}
    </section>
  );
}
