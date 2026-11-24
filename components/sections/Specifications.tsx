"use client";

import { ArrowDown, FileText, Info, Printer } from "lucide-react";
import { SPEC_GROUPS } from "@/lib/product";
import { scrollToSection } from "@/lib/animations";

const headlineStats = [
  { value: "42 mm", label: "Beryllium driver" },
  { value: "−42 dB", label: "Adaptive silence" },
  { value: "48 h", label: "Playback" },
  { value: "284 g", label: "Mass" },
];

export function Specifications() {
  return (
    <section
      id="specifications"
      data-scene="specifications"
      aria-labelledby="specifications-title"
      className="relative z-20 overflow-hidden border-t border-white/10 bg-ink py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_80%_0%,rgba(139,92,246,0.09),transparent_65%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,217,226,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(217,217,226,0.06) 1px, transparent 1px)",
          backgroundSize: "110px 110px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="section-index">05 — Specifications</p>
          <p className="hidden text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30 sm:block">
            Concept data · Fictional engineering
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2
              id="specifications-title"
              className="display-xl max-w-[11ch] text-gradient-silver"
            >
              The numbers, quietly.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="body-lg max-w-md">
              Every figure below is invented for this concept study. They describe
              the object we imagined — not a product for sale.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="chip border-violet/25 bg-violet/[0.06] text-violet-soft">
                <Info className="h-3 w-3" aria-hidden="true" />
                Fictional concept data
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.16em] text-silver/45 transition-colors hover:text-chalk"
              >
                <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                Print concept sheet
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] lg:grid-cols-4">
          {headlineStats.map((stat) => (
            <div key={stat.label} className="bg-[#0b0b0f] p-5 md:p-6">
              <p className="font-display text-[clamp(1.5rem,3vw,2.4rem)] tracking-tight text-chalk">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.5rem] uppercase tracking-[0.18em] text-silver/35">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SPEC_GROUPS.map((group, index) => (
            <section
              key={group.title}
              aria-labelledby={`spec-group-${index}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.018] p-5 transition-colors duration-500 hover:border-white/20 md:p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3
                  id={`spec-group-${index}`}
                  className="font-display text-lg font-medium tracking-tight text-chalk"
                >
                  {group.title}
                </h3>
                <span className="text-[0.5rem] tabular-nums tracking-[0.18em] text-silver/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <dl className="divide-y divide-white/[0.07]">
                {group.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-5 py-2.5"
                  >
                    <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-silver/35">
                      {row.label}
                    </dt>
                    <dd className="max-w-[58%] text-right text-[0.6875rem] leading-relaxed text-silver/70">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-3">
          {[
            {
              title: "Mechanically decoupled",
              body: "The driver floats inside the cup on a silicone isolator. Vibration is contained, so the aluminium shell stays acoustically inert.",
            },
            {
              title: "Adaptive, not aggressive",
              body: "Cancellation is tuned to preserve the shape of a room rather than erase it. Voices and transients pass through naturally.",
            },
            {
              title: "Built to be opened",
              body: "Every fastener is serviceable. The cushions attach magnetically; the battery is replaceable with a single tool.",
            },
          ].map((note) => (
            <article key={note.title}>
              <p className="label mb-3">Engineering note</p>
              <h3 className="font-display text-lg tracking-tight text-chalk">
                {note.title}
              </h3>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-silver/45">
                {note.body}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-violet-soft" aria-hidden="true" />
            <p className="max-w-xl text-[0.6875rem] leading-relaxed text-silver/45">
              All specifications are fictional concept content created for this
              design study. AURA Audio is not a real company and AURA ONE is not a
              real product.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("purchase")}
            className="btn btn-ghost h-11 shrink-0"
          >
            Continue to purchase
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
