"use client";

import Image from "next/image";
import { useState } from "react";

type Img = { url: string; altText?: string };

/** Large image with a thumbnail strip; clicking a thumbnail swaps the main image. `label` is a template containing `{n}`. */
export function ProductGallery({ images, name, label }: { images: Img[]; name: string; label: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return <div className="aspect-square rounded-[4px] bg-bench" />;
  const current = images[active];
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[4px] bg-bench">
        <Image
          src={current.url}
          alt={current.altText || name}
          width={1000}
          height={1000}
          priority
          className="aspect-square w-full object-contain p-8 mix-blend-multiply"
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3">
          {images.map((img, i) => (
            <li key={img.url}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={label.replace("{n}", String(i + 1))}
                aria-current={i === active}
                className={`h-20 w-20 overflow-hidden rounded-[4px] bg-bench outline-offset-2 ${i === active ? "ring-2 ring-ink" : "ring-1 ring-line hover:ring-slate"}`}
              >
                <Image src={img.url} alt="" width={160} height={160} className="h-full w-full object-contain p-1.5 mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
