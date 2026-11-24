export type SceneSectionId =
  | "hero"
  | "design"
  | "technology"
  | "sound"
  | "configurator"
  | "specifications"
  | "purchase";

export interface SceneSectionConfig {
  id: SceneSectionId;
  weight: number;
}

/**
 * The scroll story is mapped section-by-section rather than by raw page height.
 * Each section owns a slice of the 0–1 scene timeline, so adding content to one
 * section never breaks the choreography of the others.
 */
export const SCENE_SECTIONS: SceneSectionConfig[] = [
  { id: "hero", weight: 0.13 },
  { id: "design", weight: 0.23 },
  { id: "technology", weight: 0.22 },
  { id: "sound", weight: 0.16 },
  { id: "configurator", weight: 0.16 },
  { id: "specifications", weight: 0.04 },
  { id: "purchase", weight: 0.06 },
];

export const SECTION_RANGES = (() => {
  let cursor = 0;
  const ranges: Record<string, { start: number; end: number }> = {};
  for (const section of SCENE_SECTIONS) {
    ranges[section.id] = { start: cursor, end: cursor + section.weight };
    cursor += section.weight;
  }
  return ranges;
})();

export interface SceneState {
  progress: number;
  rawProgress: number;
  activeSection: SceneSectionId;
  sectionProgress: Record<string, number>;
  pointerX: number;
  pointerY: number;
  userRotation: number;
  userTilt: number;
  userZoom: number;
  userActive: boolean;
  interacting: boolean;
  configuratorActive: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  canvasReady: boolean;
  hoveredHotspot: string | null;
}

export const sceneState: SceneState = {
  progress: 0,
  rawProgress: 0,
  activeSection: "hero",
  sectionProgress: {},
  pointerX: 0,
  pointerY: 0,
  userRotation: 0,
  userTilt: 0,
  userZoom: 1,
  userActive: false,
  interacting: false,
  configuratorActive: false,
  isMobile: false,
  reducedMotion: false,
  canvasReady: false,
  hoveredHotspot: null,
};

export const resetSceneInteraction = () => {
  sceneState.userRotation = 0;
  sceneState.userTilt = 0;
  sceneState.userZoom = 1;
  sceneState.userActive = false;
  sceneState.interacting = false;
};

export const setSectionProgress = (id: string, value: number) => {
  sceneState.sectionProgress[id] = value;
};

export const setStoryProgress = (value: number) => {
  sceneState.progress = Math.min(1, Math.max(0, value));
};
