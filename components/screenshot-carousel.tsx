"use client";

import Image from "next/image";
import { useRef } from "react";
import type { AppScreenshot } from "@/types/app";

interface ScreenshotCarouselProps {
  screenshots: AppScreenshot[];
  appName: string;
}

export function ScreenshotCarousel({ screenshots, appName }: ScreenshotCarouselProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "prev" | "next") => {
    const node = listRef.current;
    if (!node) return;

    const card = node.querySelector<HTMLElement>("[data-screenshot-card='true']");
    const step = card ? card.offsetWidth + 16 : node.clientWidth * 0.8;
    node.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth"
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCard("prev")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-slate-700 transition hover:bg-slate-50"
          aria-label={`Previous ${appName} screenshot`}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => scrollByCard("next")}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-slate-700 transition hover:bg-slate-50"
          aria-label={`Next ${appName} screenshot`}
        >
          ›
        </button>
      </div>

      <div
        ref={listRef}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        aria-label={`${appName} screenshots carousel`}
      >
        {screenshots.map((shot) => (
          <div
            key={shot.src}
            data-screenshot-card="true"
            className="relative aspect-[9/19.5] w-[72%] min-w-[72%] snap-center overflow-hidden rounded-3xl border border-line bg-slate-100 sm:w-[56%] sm:min-w-[56%] lg:w-[80%] lg:min-w-[80%]"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 56vw, 38vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
