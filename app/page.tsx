"use client";

import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { SideRail } from "@/components/layout/SideRail";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductCanvas } from "@/components/three/ProductCanvas";
import { Hero } from "@/components/sections/Hero";
import { DesignStory } from "@/components/sections/DesignStory";
import { Technology } from "@/components/sections/Technology";
import { AudioExperience } from "@/components/sections/AudioExperience";
import { Configurator } from "@/components/sections/Configurator";
import { Specifications } from "@/components/sections/Specifications";
import { Purchase } from "@/components/sections/Purchase";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Page() {
  const storyRef = useRef<HTMLDivElement>(null);
  useScrollAnimation(storyRef);

  return (
    <>
      <Navbar />
      <ProductCanvas />
      <SideRail />
      <CartDrawer />

      <main id="main" className="relative z-10">
        <div id="top" ref={storyRef}>
          <Hero />
          <DesignStory />
          <Technology />
          <AudioExperience />
          <Configurator />
          <Specifications />
          <Purchase />
        </div>
        <Footer />
      </main>
    </>
  );
}
