"use client";

import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { HeadphoneModel, MODEL_URL } from "@/components/three/HeadphoneModel";
import { SceneLighting } from "@/components/three/SceneLighting";
import {
  SoundParticles,
  SoundRings,
} from "@/components/three/SoundParticles";
import { ProductVisual } from "@/components/product/ProductVisual";
import { useProductStore } from "@/store/useProductStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { adaptScene, sampleScene } from "@/lib/animations";
import { resetSceneInteraction, sceneState } from "@/lib/scrollState";

type Quality = "high" | "low";

function dampAngle(
  current: number,
  target: number,
  lambda: number,
  delta: number,
) {
  let difference = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (difference < -Math.PI) difference += Math.PI * 2;
  return current + difference * (1 - Math.exp(-lambda * delta));
}

interface SceneContentsProps {
  finish: ReturnType<typeof useProductStore.getState>["finish"];
  quality: Quality;
  reduced: boolean;
  glbAvailable: boolean;
}

function SceneContents({
  finish,
  quality,
  reduced,
  glbAvailable,
}: SceneContentsProps) {
  const { camera, scene } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const lookAt = useRef(new THREE.Vector3(0, 0.08, 0));
  const initialised = useRef(false);
  const time = useRef(0);

  useEffect(() => {
    scene.environmentIntensity = 1;
  }, [scene]);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onPointerMove = (event: PointerEvent) => {
      sceneState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onPointerLeave = () => {
      sceneState.pointerX = 0;
      sceneState.pointerY = 0;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.2);
    time.current += delta;
    const t = time.current;

    const key = adaptScene(
      sampleScene(reduced ? 0 : sceneState.progress),
      sceneState.isMobile,
      reduced,
    );

    const configuratorOffsetX =
      sceneState.configuratorActive && !sceneState.isMobile ? -1.45 : 0;
    const configuratorOffsetY =
      sceneState.configuratorActive && sceneState.isMobile ? -1.2 : 0;

    const targetCamera = {
      x: key.camera[0] + configuratorOffsetX,
      y: key.camera[1] + configuratorOffsetY,
      z: key.camera[2],
    };
    const targetLook = {
      x: key.target[0] + configuratorOffsetX,
      y: key.target[1] + configuratorOffsetY,
      z: key.target[2],
    };

    if (!initialised.current) {
      initialised.current = true;
      lookAt.current.set(targetLook.x, targetLook.y, targetLook.z);
    }

    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetCamera.x,
      3,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetCamera.y,
      3,
      delta,
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      targetCamera.z,
      2.7,
      delta,
    );
    lookAt.current.x = THREE.MathUtils.damp(
      lookAt.current.x,
      targetLook.x,
      3.4,
      delta,
    );
    lookAt.current.y = THREE.MathUtils.damp(
      lookAt.current.y,
      targetLook.y,
      3.4,
      delta,
    );
    lookAt.current.z = THREE.MathUtils.damp(
      lookAt.current.z,
      targetLook.z,
      3.4,
      delta,
    );
    camera.lookAt(lookAt.current);

    if (!modelRef.current) return;

    const userActive = sceneState.configuratorActive && sceneState.userActive;
    let rotationX = key.rotation[0];
    let rotationY = key.rotation[1];
    let rotationZ = key.rotation[2];

    if (userActive) {
      rotationX = sceneState.userTilt;
      rotationY = sceneState.userRotation;
      rotationZ = 0;
    } else if (!reduced) {
      rotationY +=
        Math.sin(t * 0.24) * 0.045 + sceneState.pointerX * 0.14;
      rotationX +=
        Math.sin(t * 0.31) * 0.014 + sceneState.pointerY * 0.045;
      rotationZ += Math.sin(t * 0.19) * 0.01;
    }

    modelRef.current.rotation.x = dampAngle(
      modelRef.current.rotation.x,
      rotationX,
      4,
      delta,
    );
    modelRef.current.rotation.y = dampAngle(
      modelRef.current.rotation.y,
      rotationY,
      4,
      delta,
    );
    modelRef.current.rotation.z = dampAngle(
      modelRef.current.rotation.z,
      rotationZ,
      3,
      delta,
    );

    const float =
      reduced || userActive
        ? 0
        : Math.sin(t * 0.55) * 0.045 + Math.sin(t * 0.23) * 0.018;

    modelRef.current.position.y = THREE.MathUtils.damp(
      modelRef.current.position.y,
      float * (sceneState.configuratorActive ? 0.35 : 1),
      3,
      delta,
    );

    const targetScale =
      key.scale *
      (sceneState.configuratorActive ? sceneState.userZoom : 1);

    const nextScale = THREE.MathUtils.damp(
      modelRef.current.scale.x,
      targetScale,
      4,
      delta,
    );
    modelRef.current.scale.setScalar(nextScale);

    state.invalidate();

    if (process.env.NODE_ENV !== "production") {
      (window as unknown as Record<string, unknown>).__aura = {
        progress: sceneState.progress,
        sectionProgress: { ...sceneState.sectionProgress },
        camera: camera.position.toArray().map((n) => Math.round(n * 100) / 100),
        look: lookAt.current.toArray().map((n) => Math.round(n * 100) / 100),
        key: {
          camera: key.camera,
          target: key.target,
          explode: key.explode,
          scale: key.scale,
        },
        modelRotation: [
          Math.round(modelRef.current.rotation.x * 100) / 100,
          Math.round(modelRef.current.rotation.y * 100) / 100,
        ],
        isMobile: sceneState.isMobile,
        configuratorActive: sceneState.configuratorActive,
        userActive: sceneState.userActive,
        userRotation: sceneState.userRotation,
      };
    }
  });

  return (
    <>
      <color attach="background" args={["#09090b"]} />
      <SceneLighting quality={quality} reduced={reduced} />

      <group ref={modelRef}>
        <HeadphoneModel finish={finish} glbAvailable={glbAvailable} />
      </group>

      {!reduced && (
        <>
          <SoundParticles quality={quality} reduced={reduced} />
          <SoundRings reduced={reduced} />
        </>
      )}

      {quality === "high" && !reduced && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.34}
            luminanceThreshold={0.76}
            luminanceSmoothing={0.32}
            mipmapBlur
            radius={0.6}
          />
          <Vignette offset={0.22} darkness={0.7} eskil={false} />
          <Noise
            opacity={0.018}
            blendFunction={BlendFunction.SOFT_LIGHT}
          />
        </EffectComposer>
      )}
    </>
  );
}

interface StaticStageProps {
  finish: ReturnType<typeof useProductStore.getState>["finish"];
  unsupported: boolean;
}

function StaticStage({ finish, unsupported }: StaticStageProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink">
      <div className="absolute inset-0 stage-glow" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,217,226,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(217,217,226,0.08) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage:
            "radial-gradient(ellipse 60% 55% at 50% 48%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 55% at 50% 48%, black, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center pb-10 pt-16">
        <ProductVisual
          finish={finish}
          className="h-[58vh] max-h-[600px] w-auto drop-shadow-[0_50px_90px_rgba(139,92,246,0.22)]"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink to-transparent" />
      {unsupported && (
        <p className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.5625rem] uppercase tracking-[0.2em] text-silver/35">
          Static preview · WebGL unavailable
        </p>
      )}
    </div>
  );
}

export function ProductCanvas() {
  const finish = useProductStore((state) => state.finish);
  const resetKey = useProductStore((state) => state.resetKey);
  const activeSection = useProductStore((state) => state.activeSection);
  const support = useWebGLSupport();
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [quality, setQuality] = useState<Quality>("high");
  const [glbAvailable, setGlbAvailable] = useState(false);

  useEffect(() => {
    setMounted(true);
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;
    setQuality(coarse || small || cores <= 6 ? "low" : "high");
    sceneState.isMobile = small;
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    fetch(MODEL_URL, { method: "HEAD" })
      .then((response) => {
        if (!cancelled && response.ok) {
          setGlbAvailable(true);
          useGLTF.preload(MODEL_URL);
        }
      })
      .catch(() => {
        /* The procedural model is the designed fallback. */
      });
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  useEffect(() => {
    resetSceneInteraction();
  }, [resetKey]);

  useEffect(() => {
    if (activeSection !== "configurator") {
      resetSceneInteraction();
    }
  }, [activeSection]);

  useEffect(() => {
    if (!mounted) return;
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("aura:ready"));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [mounted]);

  if (!mounted || support !== "supported") {
    return (
      <StaticStage finish={finish} unsupported={support === "unsupported"} />
    );
  }

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-ink"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, quality === "high" ? 1.75 : 1.25]}
        gl={{
          antialias: quality === "high",
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 34, near: 0.1, far: 60, position: [0, 0.55, 9.2] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 0.98;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
        className="!touch-auto"
      >
        <Suspense fallback={null}>
          <SceneContents
            finish={finish}
            quality={quality}
            reduced={reduced}
            glbAvailable={glbAvailable}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 stage-glow" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/75 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/90 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(217,217,226,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(217,217,226,0.06) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage:
            "radial-gradient(ellipse 55% 50% at 50% 45%, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 50% at 50% 45%, black, transparent 78%)",
        }}
      />
    </div>
  );
}
