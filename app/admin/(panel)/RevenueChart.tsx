"use client";

import { formatMNT } from "@/lib/utils";
import { useState } from "react";

type Point = { label: string; value: number };

export function RevenueChart({ data }: { data: Point[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720;
  const H = 220;
  const pad = { l: 10, r: 10, t: 20, b: 28 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const max = Math.max(1, ...data.map((d) => d.value));
  const n = data.length;
  const x = (i: number) => pad.l + (n <= 1 ? cw / 2 : (i / (n - 1)) * cw);
  const y = (v: number) => pad.t + ch - (v / max) * ch;

  const line = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const area = `${pad.l},${pad.t + ch} ${line} ${x(n - 1)},${pad.t + ch}`;
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-3xl border border-line p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-bold">Сүүлийн 14 хоногийн орлого</h2>
          <div className="text-2xl font-bold tracking-tight mt-1">{formatMNT(total)}</div>
        </div>
        {hover !== null && (
          <div className="text-right">
            <div className="text-xs text-ink-muted">{data[hover].label}</div>
            <div className="font-semibold text-brand-pink">{formatMNT(data[hover].value)}</div>
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 200 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f06292" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f06292" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* grid */}
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={pad.l} x2={W - pad.r} y1={pad.t + ch * g} y2={pad.t + ch * g} stroke="#F0E0E4" strokeWidth="1" />
        ))}

        <polygon points={area} fill="url(#rev)" />
        <polyline points={line} fill="none" stroke="#e91e63" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) => (
          <g key={i}>
            {(hover === i || (n <= 14)) && (
              <circle cx={x(i)} cy={y(d.value)} r={hover === i ? 5 : 2.5} fill="#e91e63" stroke="#fff" strokeWidth="1.5" />
            )}
            {/* hover hit area */}
            <rect
              x={x(i) - cw / n / 2}
              y={pad.t}
              width={cw / n}
              height={ch}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
            {i % 2 === 0 && (
              <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#9B9B9B">
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
