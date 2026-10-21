"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }}
      className="text-sm border border-black/15 rounded-full px-4 py-2 hover:border-red-400 hover:text-red-400"
    >
      Sign out
    </button>
  );
}
