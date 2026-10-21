"use client";

import { useTransition } from "react";
import { setUserRole } from "@/lib/admin-actions";

export default function RoleSelect({ userId, role }: { userId: string; role: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={role}
      disabled={pending}
      onChange={(e) => start(() => setUserRole(userId, e.target.value as never))}
      className="bg-ink-700 border border-black/10 rounded px-2 py-1 text-xs"
    >
      {["CUSTOMER", "STAFF", "MANAGER", "ADMIN"].map((r) => <option key={r}>{r}</option>)}
    </select>
  );
}
