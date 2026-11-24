"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronsUpDown, Layers3, RotateCcw } from "lucide-react";
import { TECH_PARTS } from "@/lib/product";
import { registerGsap } from "@/lib/animations";

const calloutPositions = [
  { top: "22%", left: "63%", align: "left" as const },
  { top: "44%", left: "76%", align: "right" as const },
  { top: "64%", left: "61%", align: "left" as const },
  { top: "78%", left: "74%", align: "right" as const },
];

export function Technology() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    registerGsap();
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const next = Math.round(self.progress * 100) / 100;
        setProgress((current) => (current === next ? current : next));
      },
    });
    return () => trigger.kill();
  }, []);

  const exploded = progress > 0.36;

  return (
    <section
      id="technology"
      data-scene="technology"
      ref={sectionRef}
      aria-labelledby="technology-title"
      className="relative z-10"
    >
      <div className="relative h-[280vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_72%_48%,rgba(139,92,246,0.09),transparent_70%)]" />
          <div className="shell relative flex h-full flex-col pb-6 pt-24 md:pb-9 md:pt-28">
            <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
              <div>
                <p className="section-index">02 — Technology</p>
                <h2
                  id="technology-title"
                  className="mt-3 font-display text-lg font-medium tracking-tight text-chalk md:text-xl"
                >
                  Inside the object.
                </h2>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                    exploded ? "bg-violet" : "bg-silver/30"
                  }`}
                />
                <span className="text-[0.5625rem] uppercase tracking-[0.18em] text-silver/40">
                  {exploded ? "Exploded view" : "Assembled"}
                </span>
              </div>
            </div>

            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-ink via-ink/70 to-transparent md:hidden" />
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[48%] bg-gradient-to-r from-ink/75 via-ink/35 to-transparent md:block" />

              <div className="absolute inset-x-0 top-0 grid gap-8 pt-8 md:grid-cols-12 md:pt-12">
                <div className="md:col-span-6 lg:col-span-5">
                  <h3 className="display-xl max-w-[9ch] text-gradient-silver">
                    Anatomy of silence.
                  </h3>
                  <p className="mt-5 max-w-sm text-[0.8125rem] leading-relaxed text-silver/55">
                    Four systems, one quiet architecture. Scroll to disassemble
                    AURA ONE — every layer returns exactly where it began.
                  </p>

                  <div className="mt-8 max-w-sm">
                    <div className="flex items-center justify-between text-[0.5625rem] uppercase tracking-[0.18em] text-silver/35">
                      <span>Assembly</span>
                      <span className="tabular-nums text-silver/55">
                        {Math.round(progress * 100)}%
                      </span>
                    </div>
                    <div className="relative mt-3 h-px w-full bg-white/10">
                      <span
                        className="absolute left-0 top-0 h-px bg-gradient-to-r from-violet-soft to-violet"
                        style={{ width: `${Math.max(2, progress * 100)}%` }}
                      />
                      <span
                        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet-soft shadow-[0_0_14px_rgba(167,139,250,0.8)]"
                        style={{ left: `calc(${Math.max(2, progress * 100)}% - 4px)` }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[0.5rem] uppercase tracking-[0.18em] text-silver/25">
                        Sealed
                      </span>
                      <span className="flex items-center gap-1.5 text-[0.5rem] uppercase tracking-[0.18em] text-silver/25">
                        <RotateCcw className="h-2.5 w-2.5" aria-hidden="true" />
                        Reversible
                      </span>
                      <span className="text-[0.5rem] uppercase tracking-[0.18em] text-silver/25">
                        Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annotated callouts */}
              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                {TECH_PARTS.map((part, index) => {
                  const position = calloutPositions[index];
                  const visible = progress > 0.22 + index * 0.1;
                  return (
                    <div
                      key={part.index}
                      className={`absolute transition-all duration-700 ease-luxury ${
                        visible
                          ? "translate-y-0 opacity-100"
                          : "translate-y-2 opacity-0"
                      }`}
                      style={{
                        top: position.top,
                        left: position.left,
                        transform: `translateX(${position.align === "right" ? "-100%" : "0"})`,
                      }}
                    >
                      <div
                        className={`flex items-center gap-3 ${
                          position.align === "right" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="relative grid h-4 w-4 place-items-center">
                          <span className="absolute inset-0 rounded-full border border-violet/40" />
                          <span className="h-1 w-1 rounded-full bg-violet-soft" />
                        </span>
                        <span
                          className={`h-px bg-gradient-to-r from-violet/50 to-transparent ${
                            position.align === "right"
                              ? "w-10 rotate-180"
                              : "w-10"
                          }`}
                        />
                        <div
                          className={`max-w-[11rem] ${
                            position.align === "right" ? "text-right" : ""
                          }`}
                        >
                          <p className="text-[0.5625rem] uppercase tracking-[0.16em] text-chalk/80">
                            {part.index} · {part.name}
                          </p>
                          <p className="mt-1 text-[0.5625rem] leading-relaxed text-silver/40">
                            {part.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute inset-x-0 bottom-0 grid gap-8 md:grid-cols-12 md:items-end">
                <div className="md:col-span-7 lg:col-span-6">
                  <div className="rounded-2xl border border-white/10 bg-ink/50 p-5 backdrop-blur-xl md:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.18em] text-violet-soft">
                        <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
                        Component index
                      </p>
                      <ChevronsUpDown
                        className="h-3.5 w-3.5 text-silver/30"
                        aria-hidden="true"
                      />
                    </div>
                    <ul className="divide-y divide-white/[0.07]">
                      {TECH_PARTS.map((part, index) => {
                        const active = exploded && progress > 0.3 + index * 0.06;
                        return (
                          <li
                            key={part.index}
                            className={`flex items-center justify-between gap-4 py-2.5 transition-colors duration-500 ${
                              active ? "text-chalk" : "text-silver/40"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={`text-[0.5rem] tabular-nums tracking-[0.16em] ${
                                  active ? "text-violet-soft" : "text-silver/25"
                                }`}
                              >
                                {part.index}
                              </span>
                              <span className="text-[0.6875rem] uppercase tracking-[0.12em]">
                                {part.name}
                              </span>
                            </span>
                            <span className="hidden text-[0.625rem] text-silver/35 sm:block">
                              {part.detail}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="hidden justify-end md:col-span-5 md:flex lg:col-span-6">
                  <div className="max-w-[15rem] border-l border-white/15 pl-5">
                    <p className="label mb-2">Acoustic note</p>
                    <p className="text-[0.6875rem] leading-relaxed text-silver/45">
                      The driver and chamber are mechanically decoupled. Vibration
                      never reaches the shell, so the shell never colours the
                      sound.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <p className="text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30">
                Scroll to disassemble · Scroll back to assemble
              </p>
              <p className="hidden text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30 sm:block">
                Pivot-accurate · 4 systems
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
