import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export const registerGsap = () => {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (t: number) => {
  const x = clamp(t);
  return x * x * (3 - 2 * x);
};

export interface SceneKeyframe {
  at: number;
  camera: [number, number, number];
  target: [number, number, number];
  rotation: [number, number, number];
  explode: number;
  scale: number;
  audio: number;
  bloom: number;
}

export const SCENE_KEYFRAMES: SceneKeyframe[] = [
  {
    at: 0,
    camera: [0, 0.35, 8.6],
    target: [0, 0.05, 0],
    rotation: [0, -0.32, 0],
    explode: 0,
    scale: 1,
    audio: 0,
    bloom: 0.28,
  },
  {
    at: 0.12,
    camera: [0, 0.35, 8.4],
    target: [0, 0.05, 0],
    rotation: [0, -0.14, 0],
    explode: 0,
    scale: 0.98,
    audio: 0,
    bloom: 0.28,
  },
  {
    at: 0.18,
    camera: [0, 1.95, 3.4],
    target: [0, 1.55, 0],
    rotation: [0.02, 0.06, 0],
    explode: 0,
    scale: 1,
    audio: 0,
    bloom: 0.26,
  },
  {
    at: 0.25,
    camera: [0.15, 0.05, 2.9],
    target: [1.25, -0.1, 0],
    rotation: [0, -0.06, 0],
    explode: 0,
    scale: 1,
    audio: 0,
    bloom: 0.26,
  },
  {
    at: 0.32,
    camera: [3, -0.05, 2.6],
    target: [1.5, -0.15, 0],
    rotation: [0, 0.05, 0],
    explode: 0,
    scale: 1,
    audio: 0,
    bloom: 0.26,
  },
  {
    at: 0.38,
    camera: [0, 0.3, 8.8],
    target: [0, 0.05, 0],
    rotation: [0.02, -0.28, 0],
    explode: 0,
    scale: 1,
    audio: 0,
    bloom: 0.3,
  },
  {
    at: 0.47,
    camera: [-0.55, 0.3, 9.6],
    target: [-0.3, 0.1, 0],
    rotation: [0.05, 0.42, 0],
    explode: 1,
    scale: 1,
    audio: 0,
    bloom: 0.38,
  },
  {
    at: 0.55,
    camera: [-0.55, 0.26, 9.8],
    target: [-0.3, 0.1, 0],
    rotation: [0.05, 0.58, 0],
    explode: 1,
    scale: 1,
    audio: 0,
    bloom: 0.38,
  },
  {
    at: 0.62,
    camera: [0, 0.2, 9.2],
    target: [0, 0.02, 0],
    rotation: [0.02, 0.12, 0],
    explode: 0,
    scale: 0.92,
    audio: 0.2,
    bloom: 0.32,
  },
  {
    at: 0.69,
    camera: [0, 0.12, 9.6],
    target: [0, 0.02, 0],
    rotation: [0, 0.34, 0],
    explode: 0,
    scale: 0.86,
    audio: 1,
    bloom: 0.45,
  },
  {
    at: 0.76,
    camera: [0, 0.14, 9.4],
    target: [0, 0.02, 0],
    rotation: [0, 0.22, 0],
    explode: 0,
    scale: 0.88,
    audio: 0.2,
    bloom: 0.32,
  },
  {
    at: 0.84,
    camera: [0, 0.12, 9.4],
    target: [0, 0.02, 0],
    rotation: [0, 0.24, 0],
    explode: 0,
    scale: 0.88,
    audio: 0,
    bloom: 0.28,
  },
  {
    at: 0.91,
    camera: [0, 0.1, 9.2],
    target: [0, 0.02, 0],
    rotation: [0, 0.2, 0],
    explode: 0,
    scale: 0.9,
    audio: 0,
    bloom: 0.26,
  },
  {
    at: 1,
    camera: [0, 0.08, 9.8],
    target: [0, 0, 0],
    rotation: [0, 0.16, 0],
    explode: 0,
    scale: 0.92,
    audio: 0,
    bloom: 0.22,
  },
];

const lerpArray = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export const sampleScene = (progress: number): SceneKeyframe => {
  const p = clamp(progress);
  let from = SCENE_KEYFRAMES[0];
  let to = SCENE_KEYFRAMES[SCENE_KEYFRAMES.length - 1];

  for (let i = 0; i < SCENE_KEYFRAMES.length - 1; i += 1) {
    if (p >= SCENE_KEYFRAMES[i].at && p <= SCENE_KEYFRAMES[i + 1].at) {
      from = SCENE_KEYFRAMES[i];
      to = SCENE_KEYFRAMES[i + 1];
      break;
    }
  }

  const span = to.at - from.at || 1;
  const t = smoothstep((p - from.at) / span);

  return {
    at: p,
    camera: lerpArray(from.camera, to.camera, t),
    target: lerpArray(from.target, to.target, t),
    rotation: lerpArray(from.rotation, to.rotation, t),
    explode: lerp(from.explode, to.explode, t),
    scale: lerp(from.scale, to.scale, t),
    audio: lerp(from.audio, to.audio, t),
    bloom: lerp(from.bloom, to.bloom, t),
  };
};

/**
 * Adjust the cinematic camera path for small screens and reduced-motion users.
 * Mobile keeps a wider, calmer frame; reduced motion locks to a hero composition.
 */
export const adaptScene = (
  keyframe: SceneKeyframe,
  mobile: boolean,
  reduced: boolean,
): SceneKeyframe => {
  if (reduced) {
    return {
      ...SCENE_KEYFRAMES[0],
      rotation: [0, -0.22, 0],
      scale: 1.02,
    };
  }

  if (!mobile) return keyframe;

  // Portrait phones have a very narrow field of view. Fit the whole object,
  // and pull back further while the exploded view spreads the parts apart.
  const z = Math.max(keyframe.camera[2] * 1.6, 14.4) + keyframe.explode * 1.8;
  return {
    ...keyframe,
    camera: [keyframe.camera[0] * 0.25, 0.25, z],
    target: [0, 0.05, 0],
    scale: keyframe.scale * 0.78,
    bloom: keyframe.bloom * 0.55,
  };
};

export const scrollToSection = (id: string) => {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = prefersReducedMotion();
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 1,
    behavior: reduced ? "auto" : "smooth",
  });
};
