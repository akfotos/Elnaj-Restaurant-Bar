import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { deleteProduct } from "@/lib/admin-actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit: {product.name}</h1>
        <form action={async () => { "use server"; await deleteProduct(id); redirect("/admin/products"); }}>
          <button className="text-sm text-red-400 border border-red-500/50 rounded-full px-4 py-1.5">Deactivate</button>
        </form>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
