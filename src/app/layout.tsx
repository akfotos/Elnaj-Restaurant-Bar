import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Elnaj Restaurant & Bar", template: "%s | Elnaj Restaurant & Bar" },
  description:
    "Order fresh dishes, grills and drinks from Elnaj Restaurant & Bar. Delivery and pickup available.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
