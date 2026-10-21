import Catalog from "@/components/Catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Food" };

export default function FoodPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <Catalog searchParams={searchParams} scope="food" title="Food" />;
}
