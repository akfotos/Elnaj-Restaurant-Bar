import { redirect } from "next/navigation";

export default async function FoodPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : typeof value === "string" ? [value] : []) params.append(key, item);
  }
  redirect(`/menu${params.size ? `?${params.toString()}` : ""}`);
}
