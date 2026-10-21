"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DIETARY_LABELS } from "@/lib/format";

type Cat = { id: string; name: string; slug: string };

export default function MenuFilters({
  categories,
  current,
  basePath = "/menu",
}: {
  categories: Cat[];
  current: Record<string, string | number | boolean | undefined>;
  basePath?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(String(current.q ?? ""));

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${basePath}?${params.toString()}`);
  };

  const inputCls =
    "bg-ink-800 border border-black/10 rounded-lg px-3 py-2 text-sm focus:border-brand-500";

  return (
    <form
      className="mt-6 flex flex-wrap items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        update("q", q);
      }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search dishes…"
        className={`${inputCls} w-56`}
      />
      <select
        value={String(current.category ?? "")}
        onChange={(e) => update("category", e.target.value)}
        className={inputCls}
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <select
        value={String(current.tag ?? "")}
        onChange={(e) => update("tag", e.target.value)}
        className={inputCls}
      >
        <option value="">Dietary needs</option>
        {DIETARY_LABELS.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min ¢"
        defaultValue={current.minPrice as string}
        onBlur={(e) => update("minPrice", e.target.value)}
        className={`${inputCls} w-24`}
      />
      <input
        type="number"
        placeholder="Max ¢"
        defaultValue={current.maxPrice as string}
        onBlur={(e) => update("maxPrice", e.target.value)}
        className={`${inputCls} w-24`}
      />
      <select
        value={String(current.sort ?? "popular")}
        onChange={(e) => update("sort", e.target.value)}
        className={inputCls}
      >
        <option value="popular">Most popular</option>
        <option value="price-asc">Price: low → high</option>
        <option value="price-desc">Price: high → low</option>
        <option value="name">Name A–Z</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-stone-600">
        <input
          type="checkbox"
          checked={Boolean(current.inStock)}
          onChange={(e) => update("inStock", e.target.checked ? "1" : "")}
        />
        In stock
      </label>
      <button type="submit" className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4 py-2 hover:bg-brand-600">
        Search
      </button>
    </form>
  );
}
