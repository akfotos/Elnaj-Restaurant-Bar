"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WishlistButton({ productId }: { productId: string }) {
  const [state, setState] = useState<"idle" | "saved">("idle");
  const router = useRouter();
  return (
    <button
      title="Add to wishlist"
      onClick={async () => {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.status === 401) router.push("/login");
        else setState("saved");
      }}
      className={`text-2xl ${state === "saved" ? "text-red-500" : "text-stone-500 hover:text-red-400"}`}
    >
      {state === "saved" ? "♥" : "♡"}
    </button>
  );
}
