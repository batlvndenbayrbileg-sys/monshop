import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
  const users = await db.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Хэрэглэгчид</h1>
      <p className="text-ink-muted mb-8">{users.length} нийт хэрэглэгч</p>

      <div className="bg-white rounded-3xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-ink-muted text-xs bg-bg-secondary">
              <tr>
                <th className="px-6 py-3 font-semibold tracking-widest">НЭР</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ИМЭЙЛ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">УТАС</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ЭРХ</th>
                <th className="px-6 py-3 font-semibold tracking-widest">ЗАХИАЛГА</th>
                <th className="px-6 py-3 font-semibold tracking-widest">БҮРТГҮҮЛСЭН</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-line hover:bg-bg-secondary/50">
                  <td className="px-6 py-3 font-semibold">{u.name ?? "—"}</td>
                  <td className="px-6 py-3">{u.email}</td>
                  <td className="px-6 py-3 text-ink-muted">{u.phone ?? "—"}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === "ADMIN"
                          ? "bg-brand-green text-white"
                          : "bg-bg-secondary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">{u._count.orders}</td>
                  <td className="px-6 py-3 text-ink-muted text-xs">
                    {new Date(u.createdAt).toLocaleDateString("mn-MN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
