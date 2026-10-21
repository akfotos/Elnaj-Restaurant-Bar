import { db } from "@/lib/db";
import { resolveSupport } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function SupportAdmin() {
  const messages = await db.supportMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Support inbox</h1>
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`bg-ink-800 border rounded-xl p-5 ${m.resolved ? "border-black/5 opacity-60" : "border-black/10"}`}>
            <div className="flex items-center justify-between">
              <p className="font-medium">{m.subject} — {m.name} <span className="text-stone-500 text-sm">({m.email})</span></p>
              {!m.resolved && (
                <form action={async () => { "use server"; await resolveSupport(m.id); }}>
                  <button className="text-xs border border-emerald-500/50 text-emerald-600 rounded-full px-3 py-1">Mark resolved</button>
                </form>
              )}
            </div>
            <p className="text-sm text-stone-500 mt-2">{m.message}</p>
            <p className="text-xs text-stone-500 mt-2">{new Date(m.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-stone-500">Inbox zero.</p>}
      </div>
    </div>
  );
}
