"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackSearch({ initial }: { initial: string }) {
  const [v, setV] = useState(initial);
  const router = useRouter();
  return (
    <form className="flex gap-2 mt-6 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); router.push(`/track?order=${encodeURIComponent(v)}`); }}>
      <input
        aria-label="Order number"
        required
        autoComplete="off"
        value={v}
        onChange={(e) => setV(e.target.value)}
        placeholder="Order number e.g. ELN-XXXX"
        className="min-w-0 flex-1 bg-ink-800 border border-black/10 rounded-lg px-4 py-2.5 text-sm focus:border-brand-500"
      />
      <button className="bg-brand-500 text-ink-900 font-bold rounded-lg px-5">Track</button>
    </form>
  );
}
