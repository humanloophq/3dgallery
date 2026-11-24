"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { sampleScene } from "@/lib/animations";
import { sceneState } from "@/lib/scrollState";

interface SoundParticlesProps {
  quality: "high" | "low";
  reduced: boolean;
}

export function SoundParticles({ quality, reduced }: SoundParticlesProps) {
  const count = quality === "high" ? 1100 : 360;
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const violet = new THREE.Color("#8b5cf6");
    const silver = new THREE.Color("#d9d9e2");

    for (let index = 0; index < count; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.7 + Math.random() * 2.6;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 3.4;
      positions[index * 3 + 2] = Math.sin(angle) * radius * 0.55 - 0.4;
      const color = Math.random() > 0.28 ? violet : silver;
      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
      scales[index] = 0.5 + Math.random() * 1.7;
    }

    return { positions, colors, scales };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!material.current || !points.current) return;
    const audio =
      reduced || sceneState.configuratorActive
        ? 0
        : sampleScene(sceneState.progress).audio;
    uniforms.uTime.value += delta;
    uniforms.uAudio.value = THREE.MathUtils.damp(
      uniforms.uAudio.value,
      audio,
      3,
      delta,
    );
    uniforms.uOpacity.value = THREE.MathUtils.damp(
      uniforms.uOpacity.value,
      audio > 0.01 ? 1 : 0,
      3,
      delta,
    );
    points.current.visible = uniforms.uOpacity.value > 0.01;
    points.current.rotation.y += delta * 0.045;
  });

  return (
    <points ref={points} visible={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uAudio;
          attribute vec3 aColor;
          attribute float aScale;
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec3 p = position;
            p.y += sin(uTime * 0.34 + p.x * 1.4) * 0.16;
            p.x += sin(uTime * 0.21 + p.y * 2.1) * 0.1;
            p.z += cos(uTime * 0.27 + p.x * 1.1) * 0.08;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = aScale * (26.0 / max(0.001, -mv.z)) * (1.0 + uAudio * 0.8);
            gl_Position = projectionMatrix * mv;
            vColor = aColor;
            vAlpha = 0.35 + 0.65 * uAudio;
          }
        `}
        fragmentShader={`
          uniform float uOpacity;
          varying vec3 vColor;
          varying float vAlpha;

          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float distanceToCenter = length(uv);
            float alpha = smoothstep(0.5, 0.0, distanceToCenter);
            alpha = pow(alpha, 1.6);
            gl_FragColor = vec4(vColor, alpha * vAlpha * uOpacity);
          }
        `}
      />
    </points>
  );
}

export function SoundRings({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const audio =
      reduced || sceneState.configuratorActive
        ? 0
        : sampleScene(sceneState.progress).audio;
    group.current.visible = audio > 0.02;
    rings.current.forEach((ring, index) => {
      const t = (clock.elapsedTime * 0.22 + index / 3) % 1;
      const scale = 0.85 + t * 2.6;
      ring.scale.setScalar(scale);
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = audio * (1 - t) * 0.28;
    });
  });

  return (
    <group ref={group} position={[0, 0, -1.9]} visible={false}>
      {[0, 1, 2].map((index) => (
        <mesh
          key={index}
          ref={(node) => {
            if (node) rings.current[index] = node;
          }}
        >
          <ringGeometry args={[1, 1.012, 128]} />
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
