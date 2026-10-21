"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const router = useRouter();
  return (
    <form
      className="bg-ink-800 border border-black/10 rounded-lg p-4 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, rating, comment }),
        });
        setComment("");
        router.refresh();
      }}
    >
      <p className="font-medium text-sm">Leave a review</p>
      <select value={rating} onChange={(e) => setRating(+e.target.value)} className="bg-ink-700 border border-black/10 rounded px-3 py-2 text-sm">
        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} star{r > 1 ? "s" : ""}</option>)}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="How was it?"
        className="w-full bg-ink-700 border border-black/10 rounded px-3 py-2 text-sm h-24"
      />
      <button className="bg-brand-500 text-ink-900 text-sm font-semibold rounded-lg px-4 py-2">Submit</button>
    </form>
  );
}
