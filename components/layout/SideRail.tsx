"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { NAV_LINKS } from "@/lib/product";
import { useProductStore } from "@/store/useProductStore";
import { scrollToSection } from "@/lib/animations";

const SECTION_INDEX: Record<string, string> = {
  hero: "00",
  design: "01",
  technology: "02",
  sound: "03",
  configurator: "04",
  specifications: "05",
  purchase: "06",
};

const SECTION_LABEL: Record<string, string> = {
  hero: "Overture",
  design: "Design",
  technology: "Technology",
  sound: "Sound",
  configurator: "Configure",
  specifications: "Specifications",
  purchase: "Own it",
};

export function SideRail() {
  const activeSection = useProductStore((state) => state.activeSection);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <aside
      aria-label="Page progress"
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex"
    >
      <span className="text-[0.5625rem] tracking-[0.2em] text-violet-soft">
        {SECTION_INDEX[activeSection] ?? "00"}
      </span>
      <div className="relative h-40 w-px bg-white/10">
        <span
          className="absolute left-0 top-0 w-px bg-gradient-to-b from-violet-soft to-violet transition-[height] duration-150"
          style={{ height: `${Math.max(4, progress * 100)}%` }}
        />
        {NAV_LINKS.map((link, index) => {
          const sectionProgress = (index + 1) / (NAV_LINKS.length + 1);
          return (
            <span
              key={link.id}
              className="absolute -left-[2px] h-[5px] w-[5px] rounded-full bg-white/20"
              style={{ top: `${sectionProgress * 100}%` }}
            />
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-3">
        <span className="vertical-rl rotate-180 text-[0.5rem] uppercase tracking-[0.26em] text-silver/35">
          {SECTION_LABEL[activeSection] ?? "Overture"}
        </span>
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          aria-label="Back to top"
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full border border-white/10 text-silver/40 transition-colors hover:border-white/30 hover:text-chalk"
        >
          <ArrowUp className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
