import { db } from "@/lib/db";
import { CouponManager } from "./CouponManager";

export const dynamic = "force-dynamic";

export default async function AdminCoupons() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Купон</h1>
      <p className="text-ink-muted mb-6">
        Хямдралын код үүсгээд хэрэглэгчид сагсандаа оруулж төлбөрөө хямдруулна.
      </p>
      <CouponManager
        initial={coupons.map((c) => ({
          id: c.id,
          code: c.code,
          discount: c.discount,
          minSubtotal: c.minSubtotal,
          active: c.active,
        }))}
      />
    </div>
  );
}
