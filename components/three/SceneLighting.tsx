"use client";

import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

interface SceneLightingProps {
  quality: "high" | "low";
  reduced: boolean;
}

export function SceneLighting({ quality }: SceneLightingProps) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[4.5, 6.5, 4]}
        intensity={2.5}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, 2.5, 2]}
        intensity={0.55}
        color="#e4e4ec"
      />
      <spotLight
        position={[0, 5, -5]}
        angle={0.5}
        penumbra={1}
        intensity={6}
        color="#8b5cf6"
        distance={18}
      />
      <pointLight
        position={[-3.5, -1, 3.5]}
        intensity={2.2}
        color="#8b5cf6"
        distance={10}
      />
      <pointLight
        position={[4, -1.5, 2]}
        intensity={7}
        color="#d9d9e2"
        distance={9}
      />

      <Environment resolution={quality === "high" ? 256 : 128}>
        <group rotation={[-Math.PI / 3.2, 0, 0]}>
          <Lightformer
            form="rect"
            intensity={2.8}
            position={[0, 5, -9]}
            scale={[12, 10, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            position={[-6, 1, 3]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[7, 5, 1]}
            color="#ddd6fe"
          />
          <Lightformer
            form="rect"
            intensity={1.4}
            position={[6, -1, 2]}
            rotation={[0, -Math.PI / 2, 0]}
            scale={[7, 4, 1]}
            color="#d9d9e2"
          />
          <Lightformer
            form="ring"
            intensity={2}
            position={[0, 2.5, 5]}
            scale={2.4}
            color="#f7f7fa"
          />
          <Lightformer
            form="circle"
            intensity={0.3}
            position={[0, -4, 2]}
            scale={5}
            color="#8b5cf6"
          />
        </group>
      </Environment>

      <ContactShadows
        position={[0, -1.16, 0]}
        opacity={0.62}
        scale={8.5}
        blur={2.8}
        far={4.2}
        resolution={quality === "high" ? 512 : 256}
        color="#000000"
        frames={quality === "high" ? 70 : 36}
      />
    </>
  );
}
