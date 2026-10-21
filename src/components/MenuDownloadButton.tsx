"use client";

import { useState } from "react";

export default function MenuDownloadButton({ scope }: { scope?: "food" | "drinks" }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="menu-download">
      <button type="button" disabled={pending} className="dining-text-link disabled:opacity-60" onClick={async () => {
        if (pending) return;
        setPending(true);
        setError("");
        try {
          const response = await fetch(`/api/menu/download${scope ? `?scope=${scope}` : ""}`);
          if (!response.ok || !response.headers.get("content-type")?.includes("application/pdf")) throw new Error("Download unavailable");
          const url = URL.createObjectURL(await response.blob());
          const link = document.createElement("a");
          link.href = url;
          link.download = `elnaj-${scope ?? "full"}-menu.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
          setError("The menu download is temporarily unavailable. Please try again shortly.");
        } finally {
          setPending(false);
        }
      }}>
        {pending ? "Preparing your PDF…" : `Download ${scope ?? "full"} menu (PDF)`} <span aria-hidden="true">↓</span>
      </button>
      {error && <p role="alert" className="text-sm text-brand-500 mt-3 max-w-sm">{error}</p>}
      <span className="sr-only" role="status">{pending ? "Preparing your menu download" : ""}</span>
    </div>
  );
}
