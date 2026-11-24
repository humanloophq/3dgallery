"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Hand,
  Info,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { FINISHES, getFinish, PRODUCT } from "@/lib/product";
import { sampleScene, scrollToSection } from "@/lib/animations";
import {
  resetSceneInteraction,
  sceneState,
} from "@/lib/scrollState";
import { useProductStore } from "@/store/useProductStore";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function Configurator() {
  const sectionRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    rotation: number;
    tilt: number;
  } | null>(null);
  const finish = useProductStore((state) => state.finish);
  const setFinish = useProductStore((state) => state.setFinish);
  const addToBag = useProductStore((state) => state.addToBag);
  const resetView = useProductStore((state) => state.resetView);
  const [zoomLabel, setZoomLabel] = useState(100);
  const selected = getFinish(finish);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const active = entry.isIntersecting && entry.intersectionRatio > 0.35;
        sceneState.configuratorActive = active;
        if (!active) sceneState.interacting = false;
      },
      { threshold: [0, 0.35, 0.6, 0.9] },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      sceneState.configuratorActive = false;
      sceneState.interacting = false;
    };
  }, []);

  const ensureUserRotation = () => {
    if (sceneState.userActive) return;
    const key = sampleScene(sceneState.progress);
    sceneState.userRotation = key.rotation[1];
    sceneState.userTilt = key.rotation[0];
    sceneState.userActive = true;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    ensureUserRotation();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rotation: sceneState.userRotation,
      tilt: sceneState.userTilt,
    };
    sceneState.interacting = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    sceneState.userRotation = drag.rotation + dx * 0.0085;
    sceneState.userTilt = clamp(drag.tilt + dy * 0.004, -0.45, 0.45);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      sceneState.interacting = false;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
  };

  const rotate = (direction: -1 | 1) => {
    ensureUserRotation();
    sceneState.userRotation += direction * 0.18;
  };

  const tilt = (direction: -1 | 1) => {
    ensureUserRotation();
    sceneState.userTilt = clamp(
      sceneState.userTilt + direction * 0.08,
      -0.45,
      0.45,
    );
  };

  const zoom = (delta: number) => {
    sceneState.userZoom = clamp(
      Math.round((sceneState.userZoom + delta) * 100) / 100,
      0.78,
      1.22,
    );
    setZoomLabel(Math.round(sceneState.userZoom * 100));
  };

  const handleReset = () => {
    resetSceneInteraction();
    setZoomLabel(100);
    resetView();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const key = event.key;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-", "0"].includes(key)) {
      event.preventDefault();
    }
    if (key === "ArrowLeft") rotate(-1);
    if (key === "ArrowRight") rotate(1);
    if (key === "ArrowUp") tilt(-1);
    if (key === "ArrowDown") tilt(1);
    if (key === "+" || key === "=") zoom(0.06);
    if (key === "-") zoom(-0.06);
    if (key === "0") handleReset();
  };

  return (
    <section
      id="configurator"
      data-scene="configurator"
      ref={sectionRef}
      aria-labelledby="configurator-title"
      className="relative z-10 min-h-[100svh] overflow-hidden py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_65%_50%,rgba(139,92,246,0.1),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="shell relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="section-index">04 — Configure</p>
          <p className="hidden text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30 sm:block">
            Live material preview · Real-time WebGL
          </p>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          <div className="order-2 min-w-0 lg:order-1 lg:col-span-5 xl:col-span-4">
            <div className="relative h-full rounded-2xl border border-white/10 bg-ink/60 p-5 backdrop-blur-2xl md:p-7">
              <div className="flex items-center justify-between">
                <p className="text-[0.5625rem] uppercase tracking-[0.2em] text-violet-soft">
                  Atelier 001
                </p>
                <Sparkles className="h-4 w-4 text-silver/30" aria-hidden="true" />
              </div>
              <h2
                id="configurator-title"
                className="display-md mt-4 text-chalk"
              >
                Make it yours.
              </h2>
              <p className="mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-silver/50">
                Three finishes, each milled from the same billet. The material you
                choose updates the live object — not a picture.
              </p>

              <fieldset className="mt-7">
                <legend className="label mb-3">Select a finish</legend>
                <div className="grid grid-cols-1 gap-2">
                  {FINISHES.map((option) => (
                    <label
                      key={option.id}
                      className={`group relative flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${
                        finish === option.id
                          ? "border-violet/50 bg-violet/[0.07]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="aura-finish"
                        value={option.id}
                        checked={finish === option.id}
                        onChange={() => setFinish(option.id)}
                        className="peer sr-only"
                      />
                      <span
                        className="h-9 w-9 shrink-0 rounded-full border border-white/20 shadow-inner transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: `radial-gradient(circle at 32% 26%, #ffffff55, ${option.hex} 38%, #08080b 115%)`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.75rem] font-medium tracking-wide text-chalk">
                          {option.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[0.625rem] text-silver/40">
                          {option.description}
                        </span>
                      </span>
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all ${
                          finish === option.id
                            ? "border-violet bg-violet text-white"
                            : "border-white/15 text-transparent"
                        }`}
                      >
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span className="pointer-events-none absolute inset-0 rounded-xl ring-violet/60 peer-focus-visible:ring-2" />
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.16em] text-silver/40">
                  <Info className="h-3 w-3" aria-hidden="true" />
                  {selected.name}
                </p>
                <p className="mt-2 text-[0.6875rem] leading-relaxed text-silver/50">
                  {selected.description}
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="label">AURA ONE</p>
                  <p className="mt-2 font-display text-2xl tracking-tight text-chalk">
                    ${PRODUCT.price}
                    <span className="ml-2 text-[0.5625rem] uppercase tracking-[0.16em] text-silver/35">
                      USD
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addToBag(finish, 1)}
                  className="btn btn-primary h-11 px-5"
                >
                  <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                  Add to bag
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => scrollToSection("purchase")}
                  className="group inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.16em] text-silver/50 transition-colors hover:text-chalk"
                >
                  Continue to purchase
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.16em] text-silver/40 transition-colors hover:text-chalk"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  Reset view
                </button>
              </div>
            </div>
          </div>

          <div className="order-1 min-w-0 lg:order-2 lg:col-span-7 xl:col-span-8">
            <div className="relative flex h-[46svh] min-h-[20rem] flex-col justify-between rounded-2xl border border-white/[0.07] bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(139,92,246,0.06),transparent_70%)] p-4 lg:h-full lg:min-h-[36rem] lg:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 rounded-full border border-white/10 bg-ink/50 px-3 py-1.5 backdrop-blur-md">
                  <p className="truncate text-[0.5rem] uppercase tracking-[0.18em] text-silver/50">
                    Live object · <span className="text-chalk">{selected.shortName}</span>
                  </p>
                </div>
                <div className="hidden shrink-0 rounded-full border border-white/10 bg-ink/50 px-3 py-1.5 backdrop-blur-md sm:block">
                  <p className="text-[0.5rem] uppercase tracking-[0.18em] text-silver/40">
                    {zoomLabel}% · 360°
                  </p>
                </div>
              </div>

              <div
                tabIndex={0}
                role="group"
                aria-label="AURA ONE 3D view. Drag to rotate. Use arrow keys to rotate and tilt, plus and minus to zoom, zero to reset."
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 z-10 hidden cursor-grab rounded-2xl outline-none active:cursor-grabbing lg:block"
              />

              <div className="pointer-events-none flex flex-1 flex-col items-center justify-end pb-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/50 px-3 py-1.5 text-[0.5rem] uppercase tracking-[0.16em] text-silver/45 backdrop-blur-md">
                  <Hand className="h-3 w-3" aria-hidden="true" />
                  <span className="hidden sm:inline">Drag to rotate · Use controls to zoom</span>
                  <span className="sm:hidden">Use controls to rotate</span>
                </div>
              </div>

              <div className="relative z-20 flex items-end justify-between gap-3">
                <div className="pointer-events-none hidden max-w-[12rem] sm:block">
                  <p className="text-[0.5rem] uppercase leading-relaxed tracking-[0.16em] text-silver/30">
                    {selected.name}
                    <br />
                    6061-T6 aluminium
                  </p>
                </div>
                <div className="pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-ink/55 p-1 backdrop-blur-xl sm:mx-0 sm:justify-end sm:gap-1.5 sm:p-1.5">
                  <button
                    type="button"
                    onClick={() => rotate(-1)}
                    className="btn-icon h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Rotate model left"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => rotate(1)}
                    className="btn-icon h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Rotate model right"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="mx-0.5 h-5 w-px bg-white/10 sm:mx-1" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => zoom(-0.06)}
                    disabled={zoomLabel <= 78}
                    className="btn-icon h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => zoom(0.06)}
                    disabled={zoomLabel >= 122}
                    className="btn-icon h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="mx-0.5 h-5 w-px bg-white/10 sm:mx-1" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-icon h-8 w-8 sm:h-9 sm:w-9"
                    aria-label="Reset model view"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          {[
            { label: "Frame", value: "Machined aluminium" },
            { label: "Weight", value: "284 grams" },
            { label: "Endurance", value: "48 hours" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 sm:block">
              <p className="text-[0.5rem] uppercase tracking-[0.18em] text-silver/30">
                {item.label}
              </p>
              <p className="text-[0.6875rem] text-silver/60 sm:mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
