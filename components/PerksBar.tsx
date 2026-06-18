import { Truck, RotateCcw, Sparkles, ShieldCheck } from "lucide-react";
import { Tilt3D } from "./Tilt3D";

const PERKS = [
  { icon: Truck, title: "Үнэгүй хүргэлт", desc: "100,000₮-өөс дээш" },
  { icon: RotateCcw, title: "30 хоног буцаалт", desc: "Асуултгүй" },
  { icon: Sparkles, title: "Гарын авлага", desc: "Тус бүрт зөвлөгөө" },
  { icon: ShieldCheck, title: "Найдвартай төлбөр", desc: "QPay, банкаар" },
];

export function PerksBar() {
  return (
    <section className="bg-white py-12 lg:py-20">
      <div className="max-w-8xl mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {PERKS.map((p) => (
          <Tilt3D key={p.title} max={6} className="rounded-3xl card-3d">
            <div className="relative bg-card-pink rounded-3xl px-5 py-6 shadow-3d edge-highlight overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/40 blur-2xl pointer-events-none" />
              <div className="relative flex items-center gap-4" style={{ transform: "translateZ(25px)" }}>
                <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-soft-pink">
                  <p.icon className="w-5 h-5 text-brand-pink" strokeWidth={1.8} />
                </span>
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-ink-muted mt-0.5">{p.desc}</div>
                </div>
              </div>
            </div>
          </Tilt3D>
        ))}
      </div>
    </section>
  );
}
