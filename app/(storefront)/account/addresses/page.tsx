import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const user = (await getCurrentUser())!;
  const addresses = await db.address.findMany({ where: { userId: user.id } });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-8">Хаягууд</h1>
      {addresses.length === 0 ? (
        <div className="bg-white border border-line rounded-3xl p-12 text-center text-ink-muted">
          Хаяг бүртгээгүй. Захиалга үед автоматаар хадгална.
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((a) => (
            <li key={a.id} className="bg-white border border-line rounded-3xl p-6">
              <div className="font-semibold">{a.name} · {a.phone}</div>
              <div className="text-sm text-ink-muted mt-1">
                {a.city}, {a.district}, {a.street} {a.zip && `· ${a.zip}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
