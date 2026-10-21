import Catalog from "@/components/Catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Drinks & Bar" };

export default function DrinksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <Catalog searchParams={searchParams} scope="drinks" title="Drinks & Bar" />;
}
