"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";

export function Preloader() {
  const [progress, setProgress] = useState(6);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ready = false;
    let frame = 0;
    let finishTimer = 0;

    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const timeProgress = Math.min(92, 6 + (elapsed / 1500) * 86);
      setProgress((current) => Math.max(current, timeProgress));
      if (!ready && !reduced) frame = window.requestAnimationFrame(tick);
    };

    const finish = () => {
      if (ready) return;
      ready = true;
      window.cancelAnimationFrame(frame);
      setProgress(100);
      finishTimer = window.setTimeout(() => setDone(true), 320);
    };

    const onReady = () => finish();
    window.addEventListener("aura:ready", onReady, { once: true });
    if (reduced) {
      setProgress(100);
      finishTimer = window.setTimeout(() => setDone(true), 300);
    } else {
      frame = window.requestAnimationFrame(tick);
      // Never trap the experience behind a slow or failed WebGL initialisation.
      finishTimer = window.setTimeout(finish, 2200);
    }

    return () => {
      window.removeEventListener("aura:ready", onReady);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => setHidden(true), 620);
    return () => window.clearTimeout(timer);
  }, [done]);

  if (hidden) return null;

  return (
    <div
      aria-hidden={done}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#08080a] transition-opacity duration-[600ms] ease-luxury ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 stage-glow opacity-70" />
      <div className="relative flex flex-col items-center">
        <div className="relative mb-8">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border border-violet/30" />
          <LogoMark className="h-14 w-14 text-chalk" />
        </div>
        <p className="font-display text-2xl tracking-[0.42em] text-chalk">AURA</p>
        <p className="mt-3 text-[0.5625rem] uppercase tracking-[0.3em] text-silver/40">
          Beyond Sound. Beyond Reality.
        </p>

        <div className="mt-12 w-56">
          <div className="h-px w-full overflow-hidden bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-violet-soft to-violet transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[0.5625rem] uppercase tracking-[0.2em] text-silver/35">
            <span>Calibrating acoustics</span>
            <span className="tabular-nums">{Math.round(progress)}</span>
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 text-[0.5rem] uppercase tracking-[0.24em] text-silver/25">
        A fictional concept experience
      </p>
    </div>
  );
}
