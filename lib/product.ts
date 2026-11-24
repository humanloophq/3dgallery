export type FinishId = "graphite" | "titanium" | "cosmic";

export interface Finish {
  id: FinishId;
  name: string;
  shortName: string;
  hex: string;
  accent: string;
  ring: string;
  description: string;
  metalness: number;
  roughness: number;
}

export const FINISHES: Finish[] = [
  {
    id: "graphite",
    name: "Graphite Black",
    shortName: "Graphite",
    hex: "#2A2A33",
    accent: "#8B5CF6",
    ring: "#8B5CF6",
    description: "Vapour-blasted anodised aluminium. Deep, quiet, absolute.",
    metalness: 0.86,
    roughness: 0.34,
  },
  {
    id: "titanium",
    name: "Titanium Silver",
    shortName: "Titanium",
    hex: "#C7C8D2",
    accent: "#A78BFA",
    ring: "#D9D9E2",
    description: "Hand-polished titanium with a soft satin grain and cool light.",
    metalness: 1,
    roughness: 0.22,
  },
  {
    id: "cosmic",
    name: "Cosmic Violet",
    shortName: "Cosmic",
    hex: "#5A3FB8",
    accent: "#B79BFF",
    ring: "#B79BFF",
    description: "A spectral violet anodisation that shifts with the light.",
    metalness: 0.9,
    roughness: 0.28,
  },
];

export const getFinish = (id: FinishId): Finish =>
  FINISHES.find((finish) => finish.id === id) ?? FINISHES[0];

export const PRODUCT = {
  name: "AURA ONE",
  brand: "AURA Audio",
  tagline: "Beyond Sound. Beyond Reality.",
  price: 549,
  currency: "USD",
  edition: "Concept Edition 001",
  description:
    "A reference wireless headphone built around silence. Machined aluminium, adaptive acoustics and a soundstage that dissolves the room around you.",
  sku: "AURA-ONE-001",
};

export interface SpecGroup {
  title: string;
  rows: { label: string; value: string }[];
}

export const SPEC_GROUPS: SpecGroup[] = [
  {
    title: "Acoustics",
    rows: [
      { label: "Driver", value: "42 mm beryllium-coated dynamic" },
      { label: "Frequency response", value: "5 Hz – 44 kHz" },
      { label: "Impedance", value: "32 Ω" },
      { label: "Acoustic architecture", value: "Dual-chamber, vented bass reflex" },
      { label: "Amplifier", value: "AURA A1 adaptive Class-D" },
    ],
  },
  {
    title: "Silence",
    rows: [
      { label: "Noise cancellation", value: "Adaptive hybrid, up to −42 dB" },
      { label: "Microphones", value: "8 beamforming array" },
      { label: "Transparency", value: "Natural pass-through, voice focus" },
      { label: "Wind reduction", value: "Predictive, 12-step" },
    ],
  },
  {
    title: "Connection",
    rows: [
      { label: "Wireless", value: "Bluetooth 5.4, multipoint" },
      { label: "Codecs", value: "LDAC, aptX Lossless, AAC, SBC" },
      { label: "Wired", value: "USB-C lossless, 3.5 mm analogue" },
      { label: "Spatial audio", value: "Dynamic head tracking, 6-axis" },
    ],
  },
  {
    title: "Endurance",
    rows: [
      { label: "Battery", value: "48 h (ANC off) / 32 h (ANC on)" },
      { label: "Fast charge", value: "10 min for 6 h playback" },
      { label: "Charging", value: "USB-C, Qi2 wireless" },
      { label: "Weight", value: "284 g" },
    ],
  },
  {
    title: "Materials",
    rows: [
      { label: "Frame", value: "Machined 6061 aluminium" },
      { label: "Cushions", value: "Vegan memory foam, knit wrap" },
      { label: "Headband", value: "Recycled nylon core, silicone suspension" },
      { label: "Finish", value: "Anodised, vapour-blasted" },
    ],
  },
  {
    title: "In the box",
    rows: [
      { label: "Included", value: "AURA ONE, magnetic travel case" },
      { label: "Cables", value: "USB-C to USB-C, 3.5 mm analogue" },
      { label: "Documents", value: "Concept card, care guide" },
      { label: "Warranty", value: "2-year concept coverage" },
    ],
  },
];

export interface Feature {
  index: string;
  title: string;
  description: string;
  meta: string;
}

export const FEATURES: Feature[] = [
  {
    index: "01",
    title: "Adaptive Silence",
    description:
      "Eight microphones read the room 48,000 times a second, sculpting a pocket of quiet that moves with you.",
    meta: "−42 dB",
  },
  {
    index: "02",
    title: "Spatial Presence",
    description:
      "Head-tracked spatial audio places every instrument in a stable, three-dimensional field — not inside your head.",
    meta: "6-axis",
  },
  {
    index: "03",
    title: "Lossless, Untethered",
    description:
      "A dedicated lossless pipeline carries 24-bit / 96 kHz audio over USB-C and LDAC over the air.",
    meta: "24/96",
  },
  {
    index: "04",
    title: "Forty-Eight Hours",
    description:
      "A week of listening on a single charge. Ten minutes returns six hours of playback.",
    meta: "48 h",
  },
];

export const DESIGN_CHAPTERS = [
  {
    id: "suspension",
    index: "01",
    label: "Suspension",
    title: "Weight, redistributed.",
    body: "A single arc of aluminium floats above a silicone suspension band. The load is spread across the crown of the head, so 284 grams feel like almost nothing.",
    meta: "284 g · 0.8 mm aluminium",
  },
  {
    id: "cushion",
    index: "02",
    label: "Contact",
    title: "Memory, engineered.",
    body: "Dual-density vegan memory foam is wrapped in a micro-knit that breathes. The cushion seals without pressure, holding the low end without holding you.",
    meta: "Dual density · 22 mm",
  },
  {
    id: "aluminium",
    index: "03",
    label: "Surface",
    title: "Machined, not moulded.",
    body: "Each earcup begins as a solid billet. Twenty-two minutes of milling, then a vapour-blasted anodised finish that refuses fingerprints and catches light like brushed stone.",
    meta: "6061-T6 · 22 min cycle",
  },
];

export const TECH_PARTS = [
  {
    index: "01",
    name: "Beryllium driver",
    detail: "42 mm dome, 5 Hz–44 kHz",
    offset: "left",
  },
  {
    index: "02",
    name: "Acoustic chamber",
    detail: "Dual vented bass reflex",
    offset: "right",
  },
  {
    index: "03",
    name: "Adaptive array",
    detail: "8 microphones, 48 kHz sampling",
    offset: "left",
  },
  {
    index: "04",
    name: "A1 amplifier",
    detail: "Class-D, 32 Ω, lossless path",
    offset: "right",
  },
];

export const NAV_LINKS = [
  { id: "design", label: "Design", index: "01" },
  { id: "technology", label: "Technology", index: "02" },
  { id: "sound", label: "Sound", index: "03" },
  { id: "configurator", label: "Configure", index: "04" },
  { id: "specifications", label: "Specifications", index: "05" },
];
