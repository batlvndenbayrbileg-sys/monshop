"use client";

import { Rabbit, Leaf, FlaskConical, Recycle, Sparkles } from "lucide-react";

const BADGES = [
  { icon: Rabbit, label: "CRUELTY-FREE" },
  { icon: Leaf, label: "100% VEGAN" },
  { icon: FlaskConical, label: "DERMATOLOGIST TESTED" },
  { icon: Recycle, label: "ECO-FRIENDLY PACKAGING" },
  { icon: Sparkles, label: "БАЙГАЛД ЭЭЛТЭЙ · ЦЭВЭР БҮТЭЭГДЭХҮҮН" },
];

export function AnnouncementBar() {
  // Duplicate for seamless mobile marquee
  const items = [...BADGES, ...BADGES];
  return (
    <div className="text-white" style={{ background: "linear-gradient(90deg, #e91e63 0%, #f06292 100%)" }}>
      {/* Desktop — static row */}
      <div className="hidden lg:block max-w-8xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between gap-6 py-2.5">
          {BADGES.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-[11px] font-semibold tracking-widest uppercase">
              <b.icon className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Mobile — marquee */}
      <div className="lg:hidden overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee py-2.5">
          {items.map((b, i) => (
            <span key={i} className="px-6 inline-flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase">
              <b.icon className="w-3 h-3" strokeWidth={2} />
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
