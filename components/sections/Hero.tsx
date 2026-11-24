"use client";

import { ArrowDown, ArrowUpRight, Box, CircleDot } from "lucide-react";
import { scrollToSection } from "@/lib/animations";
import { PRODUCT } from "@/lib/product";

export function Hero() {
  return (
    <section
      id="hero"
      data-scene="hero"
      aria-labelledby="hero-title"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(139,92,246,0.1),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink via-ink/55 to-transparent" />

      <div className="shell relative flex min-h-[100svh] flex-col justify-between pb-7 pt-24 md:pb-10 md:pt-28">
        <div className="flex items-start justify-between gap-8">
          <div data-hero-intro className="max-w-[16rem]">
            <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.24em] text-silver/45">
              <CircleDot className="h-2.5 w-2.5 text-violet" aria-hidden="true" />
              {PRODUCT.edition}
            </p>
            <p className="mt-4 text-[0.6875rem] leading-relaxed text-silver/40">
              A reference wireless headphone.
              <br />
              Imagined as a material study in silence.
            </p>
          </div>

          <div data-hero-intro className="hidden text-right sm:block">
            <p className="label">Live 3D object</p>
            <p className="mt-3 flex items-center justify-end gap-2 text-[0.6875rem] text-silver/45">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet" />
              </span>
              WebGL · Real-time
            </p>
          </div>
        </div>

        <div className="relative mt-auto">
          <div className="flex items-center justify-between gap-6 pb-6 md:pb-10">
            <p
              data-hero-intro
              className="max-w-[17rem] text-[0.5625rem] uppercase leading-relaxed tracking-[0.22em] text-silver/35"
            >
              Aluminium / Memory foam / Adaptive acoustics
            </p>
            <p
              data-hero-intro
              className="hidden text-right text-[0.5625rem] uppercase leading-relaxed tracking-[0.22em] text-silver/35 md:block"
            >
              Designed in Copenhagen
              <br />
              Built for the quiet
            </p>
          </div>

          <div data-hero-intro>
            <h1 id="hero-title" className="display display-hero">
              <span className="text-gradient-silver">AURA</span>{" "}
              <span className="outline-text">ONE</span>
            </h1>
          </div>

          <div className="mt-6 grid gap-7 border-t border-white/10 pt-6 md:mt-8 md:grid-cols-[1.15fr_1fr_auto] md:items-start md:gap-10 md:pt-8">
            <div data-hero-intro>
              <p className="font-display text-[clamp(1.35rem,2.2vw,2rem)] leading-tight tracking-tight text-chalk">
                Beyond Sound.
                <br />
                <span className="text-violet-soft">Beyond Reality.</span>
              </p>
              <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-silver/50">
                {PRODUCT.description}
              </p>
            </div>

            <div data-hero-intro className="flex flex-col gap-3 sm:flex-row md:justify-start">
              <button
                type="button"
                onClick={() => scrollToSection("design")}
                className="btn btn-primary"
              >
                Explore experience
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("configurator")}
                className="btn btn-ghost"
              >
                Configure
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div data-hero-intro className="flex items-end justify-between gap-8 md:flex-col md:items-end md:justify-start">
              <div>
                <p className="label">From</p>
                <p className="mt-2 font-display text-2xl tracking-tight text-chalk">
                  ${PRODUCT.price}
                  <span className="ml-2 text-[0.625rem] uppercase tracking-[0.16em] text-silver/35">
                    USD
                  </span>
                </p>
              </div>
              <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.18em] text-silver/35">
                <Box className="h-3 w-3" aria-hidden="true" />
                Concept object
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-28 right-6 hidden flex-col items-center gap-4 xl:flex">
        <span className="vertical-rl rotate-180 text-[0.5rem] uppercase tracking-[0.26em] text-silver/30">
          Scroll to experience
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-white/10">
          <span className="absolute left-0 top-0 h-4 w-px animate-scroll-cue bg-violet" />
        </span>
      </div>
    </section>
  );
}
