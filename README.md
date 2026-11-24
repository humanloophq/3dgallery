# AURA ONE — Cinematic 3D Product Experience

A fictional luxury audio concept built as a single-page, scroll-driven 3D product story.
AURA Audio and AURA ONE are invented for this design study; no real product is sold.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production check:

```bash
npm run build
npm start
```

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Three.js / React Three Fiber / drei + postprocessing
- GSAP ScrollTrigger
- Zustand (persisted finish + bag)
- Tailwind CSS
- Lucide icons

## Experience

- **Hero** — persistent full-screen R3F canvas, oversized editorial type, live 3D object.
- **Design story** — pinned macro chapters with GSAP camera choreography (suspension, cushion, aluminium).
- **Technology** — reversible exploded view with annotated components and an assembly progress rail.
- **Sound** — generated Web Audio ambient field, animated wave bars and shader particles.
- **Configurator** — real-time material switching, drag/arrow-key rotation, safe zoom, reset, add to bag.
- **Specifications** — fictional engineering data, accessible definition lists.
- **Purchase** — finish/quantity controls, add to bag, slide-out cart and a clearly labelled mock checkout.

## 3D model

The scene is designed to work with **no external assets**. A procedural headphone is rendered by default.
If `public/models/aura-one.glb` exists, it is detected and loaded instead; if loading fails, the
procedural model remains as the fallback.

## Interaction and accessibility

- Reduced motion is respected: scroll choreography locks to a calm hero frame and CSS animations stop.
- The configurator is keyboard operable (arrow keys rotate/tilt, `+`/`-` zoom, `0` resets).
- Focus states, skip link, labelled controls, `aria-pressed` finish toggles and a focus-trapped cart drawer.
- WebGL failure falls back to a static SVG product render.
- No scroll hijacking: native scrolling stays intact.
- The checkout is a demo only — no payment is processed and no product ships.

## Notes

The 404 for `/models/aura-one.glb` in the console is expected while the optional GLB is absent.
