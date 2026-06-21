import { db } from "@/lib/db";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Ангилал</h1>
      <p className="text-ink-muted mb-6">{categories.length} ангилал · бараагаа ангилалд хуваарилна</p>

      <CategoryManager
        initial={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products }))}
      />
    </div>
  );
}
