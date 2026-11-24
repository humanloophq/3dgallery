"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProductStore } from "@/store/useProductStore";
import {
  clamp,
  prefersReducedMotion,
  registerGsap,
} from "@/lib/animations";
import {
  SCENE_SECTIONS,
  SECTION_RANGES,
  sceneState,
  type SceneSectionId,
} from "@/lib/scrollState";

interface SectionMeasure {
  id: SceneSectionId;
  top: number;
  height: number;
  start: number;
  end: number;
}

/**
 * Central scroll controller.
 *
 * - Installs all ScrollTriggers inside a single GSAP context.
 * - Maps every section's own scroll progress onto the shared 0–1 scene timeline.
 * - Keeps the active section in sync for navigation without re-rendering the 3D scene.
 */
export function useScrollAnimation(storyRef: RefObject<HTMLElement | null>) {
  const setActiveSection = useProductStore((state) => state.setActiveSection);

  useEffect(() => {
    if (typeof window === "undefined") return;

    registerGsap();
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reduced = prefersReducedMotion();
    sceneState.reducedMotion = reduced;

    let sections: SectionMeasure[] = SCENE_SECTIONS.map((section) => ({
      id: section.id,
      top: 0,
      height: 1,
      start: SECTION_RANGES[section.id].start,
      end: SECTION_RANGES[section.id].end,
    }));

    const measure = () => {
      sections = sections.map((section) => {
        const el = document.querySelector<HTMLElement>(
          `[data-scene="${section.id}"]`,
        );
        if (!el) return section;
        const rect = el.getBoundingClientRect();
        return {
          ...section,
          top: rect.top + window.scrollY,
          height: Math.max(rect.height, 1),
        };
      });
      sceneState.isMobile = window.matchMedia("(max-width: 767px)").matches;
    };

    const update = () => {
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - viewport;

      if (maxScroll > 0 && scrollY >= maxScroll - 4) {
        if (!reduced) sceneState.progress = 1;
        sceneState.rawProgress = 1;
        setActiveSection("purchase");
        return;
      }

      const activePoint = scrollY + viewport * 0.5;
      let activeId: SceneSectionId = sections[0]?.id ?? "hero";
      let activeDistance = Number.POSITIVE_INFINITY;
      let progress = 0;

      for (const section of sections) {
        // Sticky sections only advance while they are pinned. Their usable
        // scroll distance is the section height minus one viewport.
        const scrollable =
          section.height > viewport * 1.2
            ? Math.max(section.height - viewport, 1)
            : section.height;
        const local = clamp((scrollY - section.top) / scrollable);
        sceneState.sectionProgress[section.id] = local;

        if (scrollY >= section.top && scrollY < section.top + section.height) {
          progress = section.start + local * (section.end - section.start);
        }

        const center = section.top + section.height / 2;
        const distance = Math.abs(center - activePoint);
        if (distance < activeDistance) {
          activeDistance = distance;
          activeId = section.id;
        }
      }

      if (scrollY >= sections[sections.length - 1].top + sections[sections.length - 1].height) {
        progress = 1;
      }

      sceneState.rawProgress = progress;
      if (!reduced) sceneState.progress = progress;
      sceneState.activeSection = activeId;
      setActiveSection(activeId);
    };

    const ctx = gsap.context(() => {
      const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const lineElements = gsap.utils.toArray<HTMLElement>("[data-reveal-line]");
      const heroElements = gsap.utils.toArray<HTMLElement>("[data-hero-intro]");

      if (reduced) {
        gsap.set(revealElements, { opacity: 1, y: 0 });
        gsap.set(lineElements, { scaleX: 1 });
        gsap.set(heroElements, { opacity: 1, y: 0 });
      } else {
        revealElements.forEach((element) => {
          gsap.fromTo(
            element,
            { y: 28, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        });

        lineElements.forEach((element) => {
          gsap.fromTo(
            element,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "power3.inOut",
              immediateRender: false,
              scrollTrigger: {
                trigger: element,
                start: "top 92%",
                once: true,
              },
            },
          );
        });

        gsap.from(heroElements, {
          opacity: 0,
          y: 26,
          duration: 1.15,
          delay: 0.35,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
    });

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: update,
      onRefresh: measure,
    });

    const onResize = () => {
      measure();
      update();
      ScrollTrigger.refresh();
    };

    measure();
    update();
    const raf = window.requestAnimationFrame(update);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      scrollTrigger.kill();
      ctx.revert();
      void storyRef;
    };
  }, [setActiveSection, storyRef]);
}
