import { getCurrentUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = (await getCurrentUser())!;
  return (
    <div>
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-8">Тохиргоо</h1>
      <div className="bg-white border border-line rounded-3xl p-6 lg:p-8 space-y-4 max-w-lg">
        <Row label="Нэр" value={user.name ?? "—"} />
        <Row label="Имэйл" value={user.email} />
        <Row label="Утас" value={user.phone ?? "—"} />
        <Row label="Эрх" value={user.role} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline py-3 border-b border-line last:border-0">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
