import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { AddressManager } from "./AddressManager";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = (await getCurrentUser())!;
  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Хүргэлтийн хаяг</h1>
      <p className="text-ink-muted mb-6 text-sm">
        Хаягаа хадгалаад төлбөр хийхдээ хурдан сонгоорой.
      </p>
      <AddressManager
        initial={addresses.map((a) => ({
          id: a.id,
          label: a.label,
          name: a.name,
          phone: a.phone,
          city: a.city,
          district: a.district,
          street: a.street,
          zip: a.zip,
          isDefault: a.isDefault,
        }))}
      />
    </div>
  );
}
