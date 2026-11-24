"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { NAV_LINKS } from "@/lib/product";
import {
  selectCartCount,
  useProductStore,
} from "@/store/useProductStore";
import { ProductVisual } from "@/components/product/ProductVisual";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const activeSection = useProductStore((state) => state.activeSection);
  const cartCount = useProductStore(selectCartCount);
  const openCart = useProductStore((state) => state.openCart);
  const menuOpen = useProductStore((state) => state.menuOpen);
  const toggleMenu = useProductStore((state) => state.toggleMenu);
  const closeMenu = useProductStore((state) => state.closeMenu);
  const finish = useProductStore((state) => state.finish);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    }, 80);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const handleNavigate = () => closeMenu();

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-700 ease-luxury ${
          scrolled || menuOpen
            ? "border-b border-white/[0.07] bg-ink/72 backdrop-blur-2xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/80 to-transparent"
        }`}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
          <Logo />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={handleNavigate}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative rounded-full px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive
                      ? "text-chalk"
                      : "text-silver/55 hover:text-chalk"
                  }`}
                >
                  <span className="mr-1.5 text-[0.5rem] text-violet/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {link.index}
                  </span>
                  {link.label}
                  <span
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-violet transition-transform duration-500 ease-luxury ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="#configurator"
              className="hidden items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-chalk/85 transition-all duration-300 hover:border-violet/60 hover:bg-violet/10 hover:text-chalk xl:inline-flex"
            >
              Build yours
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-4 text-chalk transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07]"
              aria-label={`Open bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span className="hidden text-[0.625rem] font-semibold uppercase tracking-[0.16em] sm:inline">
                Bag
              </span>
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.5625rem] font-semibold transition-colors ${
                  cartCount > 0
                    ? "bg-violet text-white"
                    : "bg-white/10 text-silver/70"
                }`}
              >
                {cartCount}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-chalk transition-colors hover:bg-white/[0.07] lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[55] lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        } transition-[opacity,visibility] duration-500`}
      >
        <div className="absolute inset-0 bg-ink/95 backdrop-blur-2xl" />
        <div className="relative flex h-full flex-col justify-between overflow-y-auto px-6 pb-8 pt-24">
          <nav aria-label="Mobile primary" className="flex flex-col">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={handleNavigate}
                className="group flex items-center justify-between border-b border-white/10 py-5"
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-[0.5625rem] tracking-[0.2em] text-violet/80">
                    {link.index}
                  </span>
                  <span className="font-display text-4xl font-medium tracking-tight text-chalk transition-colors group-hover:text-violet-soft">
                    {link.label}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-5 w-5 text-silver/40 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-chalk"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          <div className="mt-10 flex items-end justify-between gap-6">
            <div className="max-w-[15rem]">
              <div className="mb-3 flex items-center gap-2 text-silver/45">
                <LogoMark className="h-5 w-5" />
                <span className="text-[0.5625rem] uppercase tracking-[0.24em]">
                  AURA Audio
                </span>
              </div>
              <p className="text-xs leading-relaxed text-silver/50">
                A fictional concept experience. Sound, silence and material
                study.
              </p>
            </div>
            <div className="h-32 w-32 shrink-0 opacity-80">
              <ProductVisual
                finish={finish}
                className="h-full w-full"
                detail={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
