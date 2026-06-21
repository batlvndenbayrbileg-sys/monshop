import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditProductForm } from "./EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: { id: string } }) {
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { images: true, variants: true },
  });
  if (!product) notFound();

  return <EditProductForm product={JSON.parse(JSON.stringify(product))} />;
}
