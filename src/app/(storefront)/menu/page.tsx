import Catalog from "@/components/Catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Menu" };

export default function MenuPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <Catalog searchParams={searchParams} title="Menu" />;
}
