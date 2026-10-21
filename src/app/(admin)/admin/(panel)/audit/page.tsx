import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Audit log</h1>
      <div className="bg-ink-800 border border-black/10 rounded-xl overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-stone-500 border-b border-black/10">
            <tr><th className="p-3">Time</th><th className="p-3">Actor</th><th className="p-3">Action</th><th className="p-3">Entity</th><th className="p-3">Detail</th></tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-black/5 last:border-0">
                <td className="p-3 text-stone-500 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                <td className="p-3">{l.actorName ?? "system"}</td>
                <td className="p-3 text-brand-500">{l.action}</td>
                <td className="p-3 text-stone-500">{l.entity}</td>
                <td className="p-3 text-stone-500">{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p className="p-6 text-sm text-stone-500">No activity yet.</p>}
      </div>
    </div>
  );
}
