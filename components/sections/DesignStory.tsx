"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MoveUpRight, RotateCw } from "lucide-react";
import { DESIGN_CHAPTERS } from "@/lib/product";
import { prefersReducedMotion, registerGsap } from "@/lib/animations";

const hotspots = [
  { id: "suspension", label: "Suspension arc", top: "17%", left: "55%" },
  { id: "cushion", label: "Memory foam", top: "54%", left: "69%" },
  { id: "aluminium", label: "Anodised shell", top: "66%", left: "47%" },
];

export function DesignStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const next = self.progress < 0.36 ? 0 : self.progress < 0.7 ? 1 : 2;
        setActive((current) => (current === next ? current : next));
      },
    });
    return () => trigger.kill();
  }, []);

  const goToChapter = (index: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
    const progress = [0.1, 0.48, 0.86][index] ?? 0;
    window.scrollTo({
      top: top + scrollable * progress,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const chapter = DESIGN_CHAPTERS[active];

  return (
    <section
      id="design"
      data-scene="design"
      ref={sectionRef}
      aria-labelledby="design-title"
      className="relative z-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/80 to-transparent" />
      <div className="relative h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="shell flex h-full flex-col pb-6 pt-24 md:pb-9 md:pt-28">
            <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <p className="section-index">01 — Design</p>
                <h2
                  id="design-title"
                  className="mt-3 font-display text-lg font-medium tracking-tight text-chalk md:text-xl"
                >
                  The anatomy of quiet.
                </h2>
              </div>
              <div className="hidden text-right sm:block">
                <p className="label">Chapter</p>
                <p className="mt-2 font-display text-sm tracking-[0.18em] text-silver/60">
                  {String(active + 1).padStart(2, "0")} / 03
                </p>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] bg-gradient-to-r from-ink/70 to-transparent" />

              {/* Hotspots */}
              <div className="pointer-events-none absolute inset-0 hidden md:block">
                {hotspots.map((hotspot, index) => (
                  <div
                    key={hotspot.id}
                    className={`absolute transition-all duration-700 ease-luxury ${
                      active === index
                        ? "opacity-100"
                        : "opacity-35 hover:opacity-70"
                    }`}
                    style={{ top: hotspot.top, left: hotspot.left }}
                  >
                    <button
                      type="button"
                      onClick={() => goToChapter(index)}
                      className="pointer-events-auto group flex items-center gap-3"
                      aria-label={`Jump to design chapter ${index + 1}: ${hotspot.label}`}
                    >
                      <span className="relative grid h-5 w-5 place-items-center">
                        <span className="absolute inset-0 rounded-full border border-violet/50" />
                        <span className="h-1.5 w-1.5 rounded-full bg-violet-soft shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
                        {active === index && (
                          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-violet/60" />
                        )}
                      </span>
                      <span className="whitespace-nowrap rounded-full border border-white/12 bg-ink/60 px-3 py-1.5 text-[0.5625rem] uppercase tracking-[0.16em] text-silver/70 backdrop-blur-md transition-colors group-hover:border-violet/40 group-hover:text-chalk">
                        {hotspot.label}
                      </span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 grid gap-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-6 lg:col-span-5">
                  <div className="relative rounded-2xl border border-white/10 bg-ink/55 p-5 backdrop-blur-xl md:p-7">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.2em] text-violet-soft">
                        <RotateCw className="h-3 w-3" aria-hidden="true" />
                        {chapter.label}
                      </p>
                      <p className="text-[0.5625rem] tracking-[0.18em] text-silver/30">
                        {chapter.index} / 03
                      </p>
                    </div>

                    <div className="relative min-h-[8.5rem]" aria-live="polite">
                      {DESIGN_CHAPTERS.map((item, index) => (
                        <div
                          key={item.id}
                          aria-hidden={active !== index}
                          className={`transition-all duration-700 ease-luxury ${
                            active === index
                              ? "relative translate-y-0 opacity-100"
                              : "pointer-events-none absolute inset-0 translate-y-3 opacity-0"
                          }`}
                        >
                          <h3 className="display-md max-w-md text-chalk">
                            {item.title}
                          </h3>
                          <p className="mt-4 max-w-md text-[0.8125rem] leading-relaxed text-silver/55">
                            {item.body}
                          </p>
                          <p className="mt-5 text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30">
                            {item.meta}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="hidden justify-end md:col-span-6 md:flex lg:col-span-7">
                  <div className="flex flex-col items-end gap-3">
                    <span className="font-display text-[clamp(5rem,10vw,10rem)] leading-[0.7] text-white/[0.06]">
                      {String(active + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3">
                      {DESIGN_CHAPTERS.map((item, index) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => goToChapter(index)}
                          aria-label={`Go to ${item.label} chapter`}
                          aria-current={active === index ? "true" : undefined}
                          className={`group flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.16em] transition-colors ${
                            active === index
                              ? "text-chalk"
                              : "text-silver/30 hover:text-silver/70"
                          }`}
                        >
                          <span
                            className={`h-px transition-all duration-500 ${
                              active === index
                                ? "w-8 bg-violet"
                                : "w-4 bg-white/20 group-hover:bg-white/40"
                            }`}
                          />
                          {String(index + 1).padStart(2, "0")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
                <span className="vertical-rl rotate-180 text-[0.5rem] uppercase tracking-[0.24em] text-silver/25">
                  Scroll to explore material
                </span>
                <MoveUpRight
                  className="h-3.5 w-3.5 text-silver/25"
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30">
                Macro study · 3 camera positions
              </p>
              <button
                type="button"
                onClick={() => goToChapter(Math.min(2, active + 1))}
                className="group inline-flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.16em] text-silver/50 transition-colors hover:text-chalk"
              >
                Next chapter
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
