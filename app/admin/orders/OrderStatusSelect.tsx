"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OPTIONS = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [val, setVal] = useState(status);
  const [saving, setSaving] = useState(false);

  const change = async (newStatus: string) => {
    setSaving(true);
    setVal(newStatus);
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    if (!r.ok) {
      toast.error("Алдаа");
      setVal(status);
      return;
    }
    toast.success("Шинэчлэгдлээ");
    router.refresh();
  };

  return (
    <select
      value={val}
      disabled={saving}
      onChange={(e) => change(e.target.value)}
      className="bg-bg-secondary border border-line rounded-full px-3 py-1 text-xs font-semibold"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
