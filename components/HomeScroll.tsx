"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { Hero } from "./Hero";

export function HomeScroll({ children }: { children: ReactNode }) {
  const [waveOk, setWaveOk] = useState(true);

  return (
    // Sticky parent — its total height = hero (100vh) + content.
    // Hero sticks for the entire content scroll, then unsticks before footer.
    <div className="relative">
      <div className="sticky top-0 h-screen z-0 overflow-hidden">
        <Hero />
      </div>

      {/* Content overlays hero (higher z), then continues into footer naturally */}
      <div className="relative z-10">
        {waveOk && (
          <div className="absolute top-0 left-0 right-0 h-28 lg:h-48 pointer-events-none -translate-y-[55%] select-none z-10">
            <Image
              src="/wave.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
              onError={() => setWaveOk(false)}
            />
          </div>
        )}

        <div className="relative bg-white rounded-t-[40px] lg:rounded-t-[64px] pt-16 lg:pt-24 shadow-[0_-32px_80px_-16px_rgba(233,30,99,0.20)]">
          {children}
        </div>
      </div>
    </div>
  );
}
