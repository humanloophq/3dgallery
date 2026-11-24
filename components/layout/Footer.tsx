"use client";

import { useState } from "react";
import { ArrowRight, ArrowUp, Check } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { scrollToSection } from "@/lib/animations";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Design story", href: "#design" },
      { label: "Technology", href: "#technology" },
      { label: "Sound", href: "#sound" },
      { label: "Configurator", href: "#configurator" },
    ],
  },
  {
    title: "AURA ONE",
    links: [
      { label: "Specifications", href: "#specifications" },
      { label: "Own it", href: "#purchase" },
      { label: "Concept notes", href: "#specifications" },
      { label: "The quiet list", href: "#newsletter" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About the concept", href: "#design" },
      { label: "Materials", href: "#technology" },
      { label: "Accessibility", href: "#specifications" },
      { label: "Return to top", href: "#top" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email to join the concept list.");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer
      id="footer"
      className="relative z-20 overflow-hidden border-t border-white/[0.08] bg-[#08080a]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />

      <div className="overflow-hidden border-b border-white/[0.06] py-5">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, group) => (
            <div
              key={group}
              className="flex items-center gap-10"
              aria-hidden={group === 1}
            >
              {[
                "Beyond sound",
                "Beyond reality",
                "AURA ONE",
                "Concept edition 001",
                "Designed in Copenhagen",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-10 text-[0.625rem] uppercase tracking-[0.28em] text-silver/30"
                >
                  {item}
                  <span className="h-1 w-1 rounded-full bg-violet/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="shell pb-10 pt-16 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <div className="flex items-center gap-4">
              <LogoMark className="h-10 w-10 text-chalk" />
              <div>
                <p className="font-display text-lg tracking-[0.3em]">AURA</p>
                <p className="mt-1 text-[0.5rem] uppercase tracking-[0.32em] text-silver/35">
                  Audio · Concept 001
                </p>
              </div>
            </div>
            <h2 className="display mt-8 max-w-[34rem] text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]">
              The quietest thing
              <br />
              <span className="text-silver/40">you&apos;ll ever hear.</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-silver/50">
              A fictional product study in sound, silence and material. Built as
              an independent creative concept — not affiliated with any real
              audio brand.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <p className="label mb-5">{column.title}</p>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[0.8125rem] text-silver/50 transition-colors duration-300 hover:text-chalk"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          id="newsletter"
          className="mt-16 grid gap-8 border-t border-white/[0.08] pt-10 md:grid-cols-[1fr_1fr] md:items-end"
        >
          <div>
            <p className="label mb-3">The quiet list</p>
            <p className="max-w-md text-sm leading-relaxed text-silver/55">
              Occasional notes on the AURA concept, new material studies and the
              architecture of silence. No noise.
            </p>
          </div>
          <div>
            {subscribed ? (
              <div
                className="flex items-center gap-3 rounded-full border border-violet/30 bg-violet/[0.07] px-5 py-3.5"
                role="status"
              >
                <Check className="h-4 w-4 text-violet-soft" aria-hidden="true" />
                <p className="text-xs text-silver/70">
                  You&apos;re on the concept list. No email was actually sent.
                </p>
              </div>
            ) : (
              <form onSubmit={subscribe} noValidate>
                <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.025] p-1.5 transition-colors focus-within:border-violet/50">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "footer-email-error" : undefined}
                    className="h-10 min-w-0 flex-1 bg-transparent px-4 text-sm text-chalk placeholder:text-silver/25 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="btn btn-violet h-10 shrink-0 px-5"
                    aria-label="Join the concept list"
                  >
                    Join
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
                {error && (
                  <p
                    id="footer-email-error"
                    role="alert"
                    className="mt-2 px-2 text-[0.6875rem] text-red-300"
                  >
                    {error}
                  </p>
                )}
              </form>
            )}
            <p className="mt-2 px-2 text-[0.5625rem] uppercase tracking-[0.16em] text-silver/25">
              Demo form · no data leaves this page
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30">
            <span>© 2026 AURA Audio — fictional concept</span>
            <span>All specifications are invented</span>
            <span>No payments processed</span>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            className="group inline-flex items-center gap-3 self-start text-[0.625rem] uppercase tracking-[0.18em] text-silver/50 transition-colors hover:text-chalk sm:self-auto"
          >
            Return to top
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/12 transition-all duration-500 ease-luxury group-hover:-translate-y-1 group-hover:border-violet/50 group-hover:bg-violet/10">
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden">
        <p className="display -mb-[0.18em] translate-y-[0.16em] text-center text-[clamp(6rem,24vw,22rem)] leading-[0.7] text-white/[0.035]">
          AURA
        </p>
      </div>
    </footer>
  );
}
