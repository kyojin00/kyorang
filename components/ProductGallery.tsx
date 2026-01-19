"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = useMemo(() => (images?.length ? images : []), [images]);
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
        {safeImages[active] ? (
          <Image
            src={safeImages[active]}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 520px"
            priority
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-neutral-400">이미지 없음</div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {safeImages.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={[
              "relative h-20 w-20 flex-none overflow-hidden rounded-2xl border bg-white",
              i === active ? "border-neutral-900" : "border-neutral-200",
            ].join(" ")}
            aria-label={`thumbnail-${i}`}
          >
            <Image src={src} alt={`${alt}-${i}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
