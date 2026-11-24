"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { ProductVisual } from "@/components/product/ProductVisual";
import { getFinish, PRODUCT } from "@/lib/product";
import { scrollToSection } from "@/lib/animations";
import {
  getItemFinishName,
  selectCartCount,
  selectSubtotal,
  useProductStore,
} from "@/store/useProductStore";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function CartDrawer() {
  const cartOpen = useProductStore((state) => state.cartOpen);
  const closeCart = useProductStore((state) => state.closeCart);
  const items = useProductStore((state) => state.items);
  const removeItem = useProductStore((state) => state.removeItem);
  const updateItemQuantity = useProductStore((state) => state.updateItemQuantity);
  const checkoutStatus = useProductStore((state) => state.checkoutStatus);
  const orderNumber = useProductStore((state) => state.orderNumber);
  const placeDemoOrder = useProductStore((state) => state.placeDemoOrder);
  const resetCheckout = useProductStore((state) => state.resetCheckout);
  const count = useProductStore(selectCartCount);
  const subtotal = useProductStore(selectSubtotal);

  const panelRef = useRef<HTMLDivElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", city: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!cartOpen) return;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("[data-autofocus]")
        ?.focus();
    }, 120);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
      previousActive?.focus?.();
    };
  }, [cartOpen, closeCart]);

  useEffect(() => {
    if (checkoutStatus === "confirmed") {
      const timer = window.setTimeout(() => confirmationRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }
  }, [checkoutStatus]);

  useEffect(() => {
    if (!cartOpen) {
      setShowCheckout(false);
      setFormError("");
      if (checkoutStatus === "confirmed") resetCheckout();
    }
  }, [cartOpen, checkoutStatus, resetCheckout]);

  const handleClose = () => closeCart();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      setFormError("Please enter a name for the demo order.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    setFormError("");
    void placeDemoOrder();
  };

  const isProcessing = checkoutStatus === "processing";
  const isConfirmed = checkoutStatus === "confirmed";

  return (
    <div
      className="cart-shell fixed inset-0 z-[80]"
      data-open={cartOpen ? "true" : "false"}
      aria-hidden={!cartOpen}
    >
      <button
        type="button"
        tabIndex={cartOpen ? 0 : -1}
        aria-label="Close bag"
        onClick={handleClose}
        className="cart-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="cart-panel absolute inset-y-0 right-0 flex w-full max-w-[31rem] flex-col border-l border-white/10 bg-[#0b0b0f] shadow-[-40px_0_120px_rgba(0,0,0,0.65)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-4 w-4 text-violet-soft" aria-hidden="true" />
            <h2
              id="cart-title"
              className="font-display text-lg font-medium tracking-tight"
            >
              Your Bag
            </h2>
            <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[0.625rem] text-silver/60">
              {count}
            </span>
          </div>
          <button
            type="button"
            data-autofocus
            onClick={handleClose}
            className="btn-icon h-10 w-10"
            aria-label="Close bag"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 sm:px-7">
          {isConfirmed ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="relative mb-7 grid h-20 w-20 place-items-center rounded-full border border-violet/30 bg-violet/10">
                <Check className="h-8 w-8 text-violet-soft" aria-hidden="true" />
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-violet/40" />
              </div>
              <p className="eyebrow mb-3">Demo order confirmed</p>
              <h3
                ref={confirmationRef}
                tabIndex={-1}
                className="display-md max-w-[18rem] text-chalk outline-none"
              >
                Consider it reserved.
              </h3>
              <p className="mt-4 max-w-[20rem] text-sm leading-relaxed text-silver/55">
                Order <span className="text-chalk">{orderNumber}</span> is a
                demonstration only. No payment has been processed and no product
                will ship.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-ghost mt-8"
              >
                Continue exploring
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-7 grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-white/[0.025]">
                <ShoppingBag className="h-7 w-7 text-silver/35" aria-hidden="true" />
              </div>
              <p className="eyebrow mb-3">Nothing here yet</p>
              <h3 className="display-md max-w-[18rem]">Your bag is quiet.</h3>
              <p className="mt-4 max-w-[19rem] text-sm leading-relaxed text-silver/55">
                Configure AURA ONE in your finish, then return here to complete a
                demo checkout.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  window.setTimeout(() => scrollToSection("configurator"), 220);
                }}
                className="btn btn-primary mt-8"
              >
                Configure AURA ONE
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : showCheckout && !isProcessing ? (
            <div className="cart-stagger">
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="mb-6 inline-flex items-center gap-2 text-xs text-silver/50 transition-colors hover:text-chalk"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Back to bag
              </button>
              <p className="eyebrow mb-2">Step 02 / 02</p>
              <h3 className="display-md mb-6">Demo checkout</h3>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="demo-name" className="label mb-2 block">
                    Full name
                  </label>
                  <input
                    id="demo-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 text-sm text-chalk placeholder:text-silver/30 focus:border-violet/60 focus:outline-none"
                    placeholder="Alex Morgan"
                    aria-describedby={formError ? "demo-form-error" : undefined}
                  />
                </div>
                <div>
                  <label htmlFor="demo-email" className="label mb-2 block">
                    Email
                  </label>
                  <input
                    id="demo-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 text-sm text-chalk placeholder:text-silver/30 focus:border-violet/60 focus:outline-none"
                    placeholder="alex@example.com"
                    aria-describedby={formError ? "demo-form-error" : undefined}
                  />
                </div>
                <div>
                  <label htmlFor="demo-city" className="label mb-2 block">
                    City <span className="normal-case tracking-normal">(optional)</span>
                  </label>
                  <input
                    id="demo-city"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 text-sm text-chalk placeholder:text-silver/30 focus:border-violet/60 focus:outline-none"
                    placeholder="Copenhagen"
                  />
                </div>
                {formError && (
                  <p
                    id="demo-form-error"
                    role="alert"
                    className="text-xs text-red-300"
                  >
                    {formError}
                  </p>
                )}
                <div className="rounded-xl border border-violet/20 bg-violet/[0.06] p-4">
                  <p className="flex items-start gap-2.5 text-[0.6875rem] leading-relaxed text-silver/60">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-violet-soft"
                      aria-hidden="true"
                    />
                    This is a mock checkout. No payment details are collected, no
                    charge is made and no order is placed.
                  </p>
                </div>
                <button
                  type="submit"
                  className="btn btn-violet w-full"
                  disabled={isProcessing}
                >
                  Place demo order
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          ) : (
            <div className="cart-stagger">
              <div className="mb-4 flex items-center justify-between">
                <p className="eyebrow">Step 01 / 02</p>
                <p className="text-[0.625rem] uppercase tracking-[0.16em] text-silver/35">
                  {PRODUCT.edition}
                </p>
              </div>

              <ul className="space-y-3">
                {items.map((item) => {
                  const finish = getFinish(item.finish);
                  return (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-3"
                    >
                      <div className="flex gap-4">
                        <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-transparent">
                          <ProductVisual
                            finish={finish}
                            className="h-[5.5rem] w-[5.5rem]"
                            detail={false}
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-display text-base font-medium tracking-tight">
                                {PRODUCT.name}
                              </p>
                              <p className="mt-1 flex items-center gap-1.5 text-[0.6875rem] text-silver/50">
                                <span
                                  className="h-2 w-2 rounded-full border border-white/20"
                                  style={{ backgroundColor: finish.hex }}
                                  aria-hidden="true"
                                />
                                {finish.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="grid h-8 w-8 place-items-center rounded-full text-silver/40 transition-colors hover:bg-white/[0.06] hover:text-chalk"
                              aria-label={`Remove ${PRODUCT.name} in ${finish.name} from bag`}
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div
                              className="inline-flex h-8 items-center rounded-full border border-white/12"
                              role="group"
                              aria-label={`Quantity for ${finish.name}`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  updateItemQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="grid h-8 w-8 place-items-center rounded-full text-silver/60 transition-colors hover:text-chalk disabled:opacity-30"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" aria-hidden="true" />
                              </button>
                              <span className="w-6 text-center text-xs tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateItemQuantity(item.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= 9}
                                className="grid h-8 w-8 place-items-center rounded-full text-silver/60 transition-colors hover:text-chalk disabled:opacity-30"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" aria-hidden="true" />
                              </button>
                            </div>
                            <p className="text-sm tabular-nums text-chalk">
                              {currency.format(item.unitPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <Sparkles
                  className="mt-0.5 h-4 w-4 shrink-0 text-violet-soft"
                  aria-hidden="true"
                />
                <p className="text-[0.6875rem] leading-relaxed text-silver/50">
                  Each AURA ONE is a concept object. Complimentary carbon-neutral
                  delivery and a 30-day listening trial are included in this
                  demonstration.
                </p>
              </div>
            </div>
          )}
        </div>

        {!isConfirmed && items.length > 0 && (
          <div className="border-t border-white/10 bg-[#0b0b0f]/95 px-6 py-5 sm:px-7">
            <dl className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-silver/50">Subtotal</dt>
                <dd className="tabular-nums text-chalk">
                  {currency.format(subtotal)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-silver/50">Delivery</dt>
                <dd className="text-[0.6875rem] uppercase tracking-[0.14em] text-violet-soft">
                  Complimentary
                </dd>
              </div>
              <div className="hairline my-3" />
              <div className="flex items-baseline justify-between">
                <dt className="text-xs uppercase tracking-[0.16em] text-silver/60">
                  Total
                </dt>
                <dd className="font-display text-xl tabular-nums text-chalk">
                  {currency.format(subtotal)}
                </dd>
              </div>
            </dl>

            {showCheckout ? (
              <p className="mt-4 text-center text-[0.625rem] uppercase tracking-[0.14em] text-silver/35">
                Demo checkout · No payment processed
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setShowCheckout(true)}
                className="btn btn-primary mt-5 w-full"
              >
                Continue to demo checkout
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
            <p className="mt-3 text-center text-[0.625rem] leading-relaxed text-silver/30">
              Concept store · No real transactions
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-[#0b0b0f]/92 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <Loader2
                className="h-8 w-8 animate-spin text-violet-soft"
                aria-hidden="true"
              />
              <p className="mt-4 text-sm text-silver/60" role="status">
                Preparing your demo order…
              </p>
              <p className="mt-1 text-[0.625rem] uppercase tracking-[0.16em] text-silver/30">
                No payment is being processed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
