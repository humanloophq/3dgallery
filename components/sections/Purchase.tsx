"use client";

import {
  ArrowRight,
  Check,
  Info,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { ProductVisual } from "@/components/product/ProductVisual";
import { FINISHES, getFinish, PRODUCT } from "@/lib/product";
import { scrollToSection } from "@/lib/animations";
import { useProductStore } from "@/store/useProductStore";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function Purchase() {
  const finish = useProductStore((state) => state.finish);
  const setFinish = useProductStore((state) => state.setFinish);
  const quantity = useProductStore((state) => state.quantity);
  const setQuantity = useProductStore((state) => state.setQuantity);
  const addToBag = useProductStore((state) => state.addToBag);
  const selected = getFinish(finish);
  const total = PRODUCT.price * quantity;

  return (
    <section
      id="purchase"
      data-scene="purchase"
      aria-labelledby="purchase-title"
      className="relative z-20 overflow-hidden border-t border-white/10 bg-[#08080a] py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_55%_at_28%_50%,rgba(139,92,246,0.13),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />

      <div className="shell relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <p className="section-index">06 — Own it</p>
          <p className="hidden text-[0.5625rem] uppercase tracking-[0.18em] text-silver/30 sm:block">
            Concept store · Demo checkout
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 lg:col-span-7">
            <div className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.01] p-4 md:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(139,92,246,0.15),transparent_62%)]" />
              <div className="relative flex items-center justify-between gap-2">
                <span className="chip shrink-0">Concept render</span>
                <span className="min-w-0 truncate text-[0.5rem] uppercase tracking-[0.18em] text-silver/30">
                  AURA ONE · {selected.shortName}
                </span>
              </div>

              <div className="relative flex h-[22rem] items-center justify-center md:h-[30rem]">
                <div className="absolute h-56 w-56 rounded-full border border-white/[0.06] md:h-80 md:w-80" />
                <div className="absolute h-40 w-40 rounded-full border border-violet/15 md:h-56 md:w-56" />
                <ProductVisual
                  finish={selected}
                  className="h-full w-auto max-h-[26rem] max-w-full drop-shadow-[0_40px_70px_rgba(0,0,0,0.55)] transition-transform duration-1000 ease-luxury group-hover:scale-[1.025] md:max-h-[29rem]"
                />
              </div>

              <div className="relative flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
                <div className="min-w-0">
                  <p className="text-[0.5625rem] uppercase tracking-[0.18em] text-silver/35">
                    Finish
                  </p>
                  <p className="mt-1 font-display text-lg tracking-tight text-chalk">
                    {selected.name}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {FINISHES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFinish(option.id)}
                      aria-label={`Select ${option.name}`}
                      aria-pressed={finish === option.id}
                      className={`h-8 w-8 rounded-full border transition-all duration-300 ${
                        finish === option.id
                          ? "scale-110 border-violet ring-2 ring-violet/30 ring-offset-2 ring-offset-[#0b0b0f]"
                          : "border-white/20 hover:scale-105"
                      }`}
                      style={{
                        background: `radial-gradient(circle at 32% 26%, #ffffff55, ${option.hex} 40%, #08080b 115%)`,
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => scrollToSection("configurator")}
                    className="ml-1 hidden text-[0.5625rem] uppercase tracking-[0.16em] text-silver/40 transition-colors hover:text-chalk sm:inline"
                  >
                    Customise
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Complimentary delivery" },
                { icon: RotateCcw, label: "30-day listening trial" },
                { icon: ShieldCheck, label: "2-year concept coverage" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 md:flex-row md:items-center"
                >
                  <item.icon
                    className="h-4 w-4 shrink-0 text-violet-soft/70"
                    aria-hidden="true"
                  />
                  <span className="text-[0.5625rem] uppercase leading-relaxed tracking-[0.12em] text-silver/40">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="label mb-3">AURA ONE</p>
              <h2
                id="purchase-title"
                className="display-lg max-w-[10ch] text-gradient-silver"
              >
                A quieter way to own sound.
              </h2>
              <p className="mt-5 max-w-md text-[0.8125rem] leading-relaxed text-silver/50">
                {PRODUCT.description}
              </p>

              <div className="mt-7 flex items-baseline gap-3">
                <p className="font-display text-4xl tracking-tight text-chalk">
                  {currency.format(PRODUCT.price)}
                </p>
                <span className="text-[0.5625rem] uppercase tracking-[0.16em] text-silver/35">
                  USD · Concept edition
                </span>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <p className="label">Selected finish</p>
                  <button
                    type="button"
                    onClick={() => scrollToSection("configurator")}
                    className="text-[0.5625rem] uppercase tracking-[0.16em] text-violet-soft/80 transition-colors hover:text-violet-soft"
                  >
                    Change
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {FINISHES.map((option) => (                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFinish(option.id)}
                      aria-pressed={finish === option.id}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all duration-300 ${
                        finish === option.id
                          ? "border-violet/50 bg-violet/[0.07]"
                          : "border-white/10 bg-white/[0.02] hover:border-white/25"
                      }`}
                    >
                      <span
                        className="h-5 w-5 shrink-0 rounded-full border border-white/20"
                        style={{
                          background: `radial-gradient(circle at 32% 26%, #ffffff55, ${option.hex} 40%, #08080b 115%)`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.5625rem] uppercase tracking-[0.1em] text-silver/70">
                          {option.shortName}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="label">Quantity</p>
                  <div
                    className="inline-flex h-10 items-center rounded-full border border-white/12 bg-white/[0.02]"
                    role="group"
                    aria-label="Quantity"
                  >
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                      className="grid h-10 w-10 place-items-center rounded-full text-silver/60 transition-colors hover:text-chalk disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums text-chalk">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= 9}
                      className="grid h-10 w-10 place-items-center rounded-full text-silver/60 transition-colors hover:text-chalk disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <dl className="mt-5 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-silver/45">Subtotal</dt>
                    <dd className="tabular-nums text-chalk">
                      {currency.format(total)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <dt className="text-silver/45">Delivery</dt>
                    <dd className="text-[0.625rem] uppercase tracking-[0.14em] text-violet-soft">
                      Complimentary
                    </dd>
                  </div>
                  <div className="hairline my-3" />
                  <div className="flex items-baseline justify-between">
                    <dt className="text-[0.625rem] uppercase tracking-[0.16em] text-silver/50">
                      Total
                    </dt>
                    <dd className="font-display text-2xl tabular-nums text-chalk">
                      {currency.format(total)}
                    </dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => addToBag(finish, quantity)}
                  className="btn btn-primary mt-6 w-full"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Add to bag
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <p className="mt-3 flex items-start justify-center gap-2 text-center text-[0.5625rem] leading-relaxed text-silver/30">
                  <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  Demo store only. No payment is processed and no product ships.
                </p>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="flex items-center gap-2 text-[0.5625rem] uppercase tracking-[0.18em] text-silver/40">
                  <Sparkles className="h-3.5 w-3.5 text-violet-soft" aria-hidden="true" />
                  In the box
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    "AURA ONE headphones",
                    "Magnetic travel case",
                    "USB-C lossless cable",
                    "3.5 mm analogue cable",
                    "Concept card",
                    "Care guide",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-[0.6875rem] text-silver/50"
                    >
                      <Check className="h-3 w-3 shrink-0 text-violet-soft/70" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
