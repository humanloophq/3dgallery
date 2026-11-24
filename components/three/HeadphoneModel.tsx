"use client";

import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { getFinish, type FinishId } from "@/lib/product";
import { sampleScene } from "@/lib/animations";
import { sceneState } from "@/lib/scrollState";

const MODEL_URL = "/models/aura-one.glb";

interface HeadphoneMaterials {
  aluminum: THREE.MeshPhysicalMaterial;
  aluminumDark: THREE.MeshPhysicalMaterial;
  leather: THREE.MeshPhysicalMaterial;
  foam: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  driver: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  glow: THREE.MeshBasicMaterial;
}

function useHeadphoneMaterials(finish: FinishId): HeadphoneMaterials {
  const materials = useMemo<HeadphoneMaterials>(() => {
    return {
      aluminum: new THREE.MeshPhysicalMaterial({
        color: "#2A2A33",
        metalness: 0.86,
        roughness: 0.34,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.15,
      }),
      aluminumDark: new THREE.MeshPhysicalMaterial({
        color: "#15151b",
        metalness: 0.92,
        roughness: 0.38,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.85,
      }),
      leather: new THREE.MeshPhysicalMaterial({
        color: "#15151a",
        metalness: 0.04,
        roughness: 0.88,
        clearcoat: 0.08,
        clearcoatRoughness: 0.7,
        sheen: 0.45,
        sheenColor: new THREE.Color("#6a6a75"),
        sheenRoughness: 0.85,
        envMapIntensity: 0.6,
      }),
      foam: new THREE.MeshStandardMaterial({
        color: "#1d1d24",
        metalness: 0.02,
        roughness: 1,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: "#8b5cf6",
        emissive: new THREE.Color("#8b5cf6"),
        emissiveIntensity: 0.4,
        metalness: 0.65,
        roughness: 0.28,
        toneMapped: false,
      }),
      driver: new THREE.MeshStandardMaterial({
        color: "#32323d",
        metalness: 0.95,
        roughness: 0.36,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: "#0c0c10",
        metalness: 0.3,
        roughness: 0.7,
      }),
      glow: new THREE.MeshBasicMaterial({
        color: "#8b5cf6",
        transparent: true,
        opacity: 0.9,
        toneMapped: false,
      }),
    };
  }, []);

  useEffect(() => {
    const data = getFinish(finish);
    materials.aluminum.color.set(data.hex);
    materials.aluminum.metalness = data.metalness;
    materials.aluminum.roughness = data.roughness;
    materials.aluminumDark.color
      .copy(new THREE.Color(data.hex))
      .multiplyScalar(0.42);
    materials.accent.color.set(data.accent);
    materials.accent.emissive.set(data.accent);
    materials.glow.color.set(data.accent);
  }, [finish, materials]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((material) => material.dispose());
    };
  }, [materials]);

  return materials;
}

interface EarcupProps {
  side: -1 | 1;
  materials: HeadphoneMaterials;
  cupRef: RefObject<THREE.Group | null>;
  cushionRef: RefObject<THREE.Group | null>;
  driverRef: RefObject<THREE.Group | null>;
}

function Earcup({
  side,
  materials,
  cupRef,
  cushionRef,
  driverRef,
}: EarcupProps) {
  const screws = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return [Math.cos(angle) * 0.56, Math.sin(angle) * 0.56] as const;
      }),
    [],
  );

  return (
    <group ref={cupRef} position={[side * 1.52, -0.15, 0]}>
      {/* machined cup body */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        material={materials.aluminum}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.78, 0.78, 0.32, 72, 1]} />
      </mesh>

      {/* polished outer face */}
      <mesh
        position={[side * 0.17, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.aluminumDark}
        castShadow
      >
        <cylinderGeometry args={[0.6, 0.62, 0.045, 64]} />
      </mesh>

      {/* outer bevel */}
      <mesh
        position={[side * 0.165, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={materials.aluminum}
      >
        <torusGeometry args={[0.72, 0.032, 16, 96]} />
      </mesh>

      {/* violet signature ring */}
      <mesh
        position={[side * 0.198, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={materials.accent}
      >
        <torusGeometry args={[0.4, 0.009, 12, 96]} />
      </mesh>

      {/* centre detail */}
      <mesh
        position={[side * 0.212, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.accent}
      >
        <cylinderGeometry args={[0.038, 0.038, 0.012, 24]} />
      </mesh>

      {/* seam around the cup */}
      <mesh
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={materials.aluminumDark}
      >
        <torusGeometry args={[0.782, 0.012, 10, 96]} />
      </mesh>

      {/* inner rim */}
      <mesh
        position={[-side * 0.16, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={materials.dark}
      >
        <torusGeometry args={[0.67, 0.028, 12, 96]} />
      </mesh>

      {/* fasteners */}
      {screws.map(([y, z], index) => (
        <mesh
          key={index}
          position={[side * 0.19, y, z]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.aluminumDark}
        >
          <cylinderGeometry args={[0.018, 0.018, 0.018, 10]} />
        </mesh>
      ))}

      {/* driver assembly */}
      <group ref={driverRef} position={[-side * 0.08, 0, 0]}>
        <mesh
          rotation={[0, 0, Math.PI / 2]}
          material={materials.driver}
          castShadow
        >
          <cylinderGeometry args={[0.44, 0.44, 0.055, 56]} />
        </mesh>
        {[0.36, 0.25, 0.14].map((radius) => (
          <mesh
            key={radius}
            position={[-side * 0.035, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material={materials.accent}
          >
            <torusGeometry args={[radius, 0.0055, 8, 72]} />
          </mesh>
        ))}
        <mesh
          position={[-side * 0.045, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={materials.glow}
        >
          <circleGeometry args={[0.075, 32]} />
        </mesh>
        <mesh
          position={[-side * 0.04, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.dark}
        >
          <cylinderGeometry args={[0.085, 0.085, 0.03, 32]} />
        </mesh>
      </group>

      {/* memory foam cushion */}
      <group ref={cushionRef} position={[-side * 0.27, 0, 0]}>
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          material={materials.leather}
          castShadow
        >
          <torusGeometry args={[0.48, 0.2, 32, 72]} />
        </mesh>
        <mesh
          position={[side * 0.08, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.foam}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.14, 48]} />
        </mesh>
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          material={materials.dark}
        >
          <torusGeometry args={[0.682, 0.005, 8, 96]} />
        </mesh>
        <mesh
          position={[side * 0.02, 0, 0]}
          rotation={[0, Math.PI / 2, 0]}
          material={materials.accent}
        >
          <torusGeometry args={[0.67, 0.0025, 6, 96]} />
        </mesh>
      </group>
    </group>
  );
}

interface YokeProps {
  side: -1 | 1;
  materials: HeadphoneMaterials;
  yokeRef: RefObject<THREE.Group | null>;
}

function Yoke({ side, materials, yokeRef }: YokeProps) {
  return (
    <group ref={yokeRef} position={[side * 1.45, 0, 0]}>
      <mesh position={[0, 0.13, 0.17]} material={materials.aluminum} castShadow>
        <capsuleGeometry args={[0.042, 0.58, 8, 20]} />
      </mesh>
      <mesh position={[0, 0.13, -0.17]} material={materials.aluminum} castShadow>
        <capsuleGeometry args={[0.042, 0.58, 8, 20]} />
      </mesh>
      <mesh
        position={[0, 0.42, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={materials.aluminum}
      >
        <cylinderGeometry args={[0.046, 0.046, 0.38, 20]} />
      </mesh>
      <mesh
        position={[0, -0.18, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={materials.aluminumDark}
      >
        <cylinderGeometry args={[0.076, 0.076, 0.22, 28]} />
      </mesh>
      <mesh
        position={[side * 0.12, -0.18, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={materials.accent}
      >
        <torusGeometry args={[0.079, 0.006, 8, 32]} />
      </mesh>
    </group>
  );
}

interface AssemblyProps {
  materials: HeadphoneMaterials;
}

function ProceduralHeadphones({ materials }: AssemblyProps) {
  const bandRef = useRef<THREE.Group>(null);
  const yokeLeft = useRef<THREE.Group>(null);
  const yokeRight = useRef<THREE.Group>(null);
  const cupLeft = useRef<THREE.Group>(null);
  const cupRight = useRef<THREE.Group>(null);
  const cushionLeft = useRef<THREE.Group>(null);
  const cushionRight = useRef<THREE.Group>(null);
  const driverLeft = useRef<THREE.Group>(null);
  const driverRight = useRef<THREE.Group>(null);
  const explode = useRef(0);

  useFrame((_, delta) => {
    const target = sceneState.reducedMotion
      ? 0
      : sampleScene(sceneState.progress).explode;
    explode.current = THREE.MathUtils.damp(explode.current, target, 4.2, delta);
    const e = explode.current;

    if (bandRef.current) {
      bandRef.current.position.y = 0.42 + e * 0.55;
      bandRef.current.rotation.x = -e * 0.07;
      bandRef.current.rotation.z = e * 0.02;
    }
    if (yokeLeft.current) {
      yokeLeft.current.position.x = -1.45 - e * 0.12;
      yokeLeft.current.position.y = e * 0.18;
      yokeLeft.current.rotation.z = e * 0.09;
    }
    if (yokeRight.current) {
      yokeRight.current.position.x = 1.45 + e * 0.12;
      yokeRight.current.position.y = e * 0.18;
      yokeRight.current.rotation.z = -e * 0.09;
    }
    if (cupLeft.current) {
      cupLeft.current.position.x = -1.52 - e * 0.48;
      cupLeft.current.rotation.y = e * 0.16;
      cupLeft.current.rotation.z = e * 0.04;
    }
    if (cupRight.current) {
      cupRight.current.position.x = 1.52 + e * 0.48;
      cupRight.current.rotation.y = -e * 0.16;
      cupRight.current.rotation.z = -e * 0.04;
    }
    if (cushionLeft.current) {
      cushionLeft.current.position.x = 0.27 + e * 0.42;
      cushionLeft.current.rotation.z = e * 0.12;
    }
    if (cushionRight.current) {
      cushionRight.current.position.x = -0.27 - e * 0.42;
      cushionRight.current.rotation.z = -e * 0.12;
    }
    if (driverLeft.current) {
      driverLeft.current.position.x = 0.08 - e * 0.22;
      driverLeft.current.rotation.z = -e * 0.16;
    }
    if (driverRight.current) {
      driverRight.current.position.x = -0.08 + e * 0.22;
      driverRight.current.rotation.z = e * 0.16;
    }
  });

  return (
    <group>
      <group ref={bandRef} position={[0, 0.42, 0]}>
        <mesh material={materials.aluminum} castShadow receiveShadow>
          <torusGeometry args={[1.45, 0.135, 28, 140, Math.PI]} />
        </mesh>
        <mesh material={materials.leather} position={[0, -0.035, 0]}>
          <torusGeometry args={[1.335, 0.072, 20, 120, Math.PI]} />
        </mesh>
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 0, Math.PI / 2 - 0.3]}
          material={materials.accent}
        >
          <torusGeometry args={[1.454, 0.0085, 8, 64, 0.6]} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * 1.45, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            material={materials.aluminumDark}
          >
            <cylinderGeometry args={[0.142, 0.142, 0.075, 32]} />
          </mesh>
        ))}
      </group>

      <Yoke side={-1} materials={materials} yokeRef={yokeLeft} />
      <Yoke side={1} materials={materials} yokeRef={yokeRight} />

      <Earcup
        side={-1}
        materials={materials}
        cupRef={cupLeft}
        cushionRef={cushionLeft}
        driverRef={driverLeft}
      />
      <Earcup
        side={1}
        materials={materials}
        cupRef={cupRight}
        cushionRef={cushionRight}
        driverRef={driverRight}
      />
    </group>
  );
}

interface GlbProps {
  materials: HeadphoneMaterials;
}

function GlbHeadphones({ materials }: GlbProps) {
  const { scene } = useGLTF(MODEL_URL);
  const root = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
      const name = object.name.toLowerCase();
      if (name.includes("leather") || name.includes("cushion")) {
        object.material = materials.leather;
      } else if (name.includes("foam")) {
        object.material = materials.foam;
      } else if (name.includes("accent")) {
        object.material = materials.accent;
      } else if (name.includes("driver")) {
        object.material = materials.driver;
      } else if (name.includes("dark")) {
        object.material = materials.dark;
      } else {
        object.material = materials.aluminum;
      }
    });
    return cloned;
  }, [scene, materials]);

  const parts = useMemo(() => {
    const map: Record<string, THREE.Object3D> = {};
    root.traverse((object) => {
      if (object.name.startsWith("part_")) map[object.name] = object;
    });
    return map;
  }, [root]);

  const base = useMemo(() => {
    const map: Record<string, THREE.Vector3> = {};
    Object.entries(parts).forEach(([name, object]) => {
      map[name] = object.position.clone();
    });
    return map;
  }, [parts]);

  const explode = useRef(0);

  useFrame((_, delta) => {
    const target = sceneState.reducedMotion
      ? 0
      : sampleScene(sceneState.progress).explode;
    explode.current = THREE.MathUtils.damp(explode.current, target, 4.2, delta);
    const e = explode.current;
    if (e < 0.0005) return;

    const apply = (name: string, offset: THREE.Vector3) => {
      const object = parts[name];
      const origin = base[name];
      if (!object || !origin) return;
      object.position.set(
        origin.x + offset.x,
        origin.y + offset.y,
        origin.z + offset.z,
      );
    };

    const band = parts.part_headband;
    if (band && base.part_headband) {
      band.position.y = base.part_headband.y + e * 0.55;
    }

    (["L", "R"] as const).forEach((sideLabel) => {
      const side = sideLabel === "L" ? -1 : 1;
      apply(`part_yoke_${sideLabel}`, new THREE.Vector3(side * e * 0.12, e * 0.18, 0));
      apply(`part_cup_${sideLabel}`, new THREE.Vector3(side * e * 0.48, 0, 0));
      apply(`part_cushion_${sideLabel}`, new THREE.Vector3(-side * e * 0.42, 0, 0));
      apply(`part_driver_${sideLabel}`, new THREE.Vector3(side * e * 0.22, 0, 0));
    });
  });

  return <primitive object={root} />;
}

interface BoundaryProps {
  fallback: ReactNode;
  onError: () => void;
  children: ReactNode;
}

class GlbErrorBoundary extends Component<
  BoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

interface HeadphoneModelProps {
  finish: FinishId;
  glbAvailable: boolean;
}

export function HeadphoneModel({
  finish,
  glbAvailable,
}: HeadphoneModelProps) {
  const materials = useHeadphoneMaterials(finish);
  const [glbFailed, setGlbFailed] = useState(false);

  const fallback = <ProceduralHeadphones materials={materials} />;

  if (!glbAvailable || glbFailed) return fallback;

  return (
    <GlbErrorBoundary fallback={fallback} onError={() => setGlbFailed(true)}>
      <Suspense fallback={fallback}>
        <GlbHeadphones materials={materials} />
      </Suspense>
    </GlbErrorBoundary>
  );
}

export { MODEL_URL };
