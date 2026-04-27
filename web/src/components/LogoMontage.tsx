"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const montageFrames = [
  { src: "/pdf-pages/wiper-page-3-crop.png", alt: "WIPER logo on white", bg: "#ffffff" },
  { src: "/pdf-pages/wiper-page-4-crop.png", alt: "WIPER logo on pink", bg: "#ff007d" },
  { src: "/pdf-pages/wiper-page-5-crop.png", alt: "WIPER logo on navy", bg: "#1e3951" },
];

export function LogoMontage() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 3100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="logo-montage fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-white">
      <div className="montage-flash" />
      {montageFrames.map((frame, index) => (
        <div
          className="montage-frame absolute inset-0 grid place-items-center"
          key={frame.src}
          style={{ animationDelay: `${index * 820}ms`, backgroundColor: frame.bg }}
        >
          <Image
            alt={frame.alt}
            className="h-full w-full object-contain"
            height={578}
            priority={index === 0}
            src={frame.src}
            unoptimized
            width={1024}
          />
        </div>
      ))}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-xs font-black uppercase tracking-[0.45em] text-[#1E3951]">
        WIPER
      </div>
    </div>
  );
}
