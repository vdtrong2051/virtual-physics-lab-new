import { useMemo, useRef } from "react";

import { useFrame } from "@react-three/fiber";

import * as THREE from "three";

type MutableNumberRef = {
  current: number;
};

type GasParticlesProps = {
  volume: number;
  visible: boolean;
  tempSpikeRef: MutableNumberRef;

  baseY: number;
  volumeScale: number;
  cylinderRadius: number;
  maxVolume: number;
};

type ParticleState = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
};

const PARTICLE_COUNT = 80;

function pseudoRandom(seed: number): number {
  const value =
    Math.sin(seed * 12.9898) *
    43758.5453;

  return value - Math.floor(value);
}

export default function GasParticles({
  volume,
  visible,
  tempSpikeRef,
  baseY,
  volumeScale,
  cylinderRadius,
  maxVolume,
}: GasParticlesProps) {
  const groupRef =
    useRef<THREE.Group>(null);

  const particles =
    useMemo<ParticleState[]>(() => {
      const radius =
        cylinderRadius - 0.02;

      return Array.from(
        { length: PARTICLE_COUNT },
        (_, index) => {
          const seed =
            index + 1;

          const radialRandom =
            pseudoRandom(
              seed * 1.17,
            );

          const angleRandom =
            pseudoRandom(
              seed * 2.31,
            );

          const heightRandom =
            pseudoRandom(
              seed * 3.73,
            );

          const velocityX =
            pseudoRandom(
              seed * 4.91,
            ) - 0.5;

          const velocityY =
            pseudoRandom(
              seed * 6.17,
            ) - 0.5;

          const velocityZ =
            pseudoRandom(
              seed * 7.43,
            ) - 0.5;

          const r =
            radius *
            Math.sqrt(
              radialRandom,
            );

          const theta =
            angleRandom *
            Math.PI *
            2;

          const velocity =
            new THREE.Vector3(
              velocityX,
              velocityY,
              velocityZ,
            ).normalize();

          return {
            position:
              new THREE.Vector3(
                r *
                  Math.cos(
                    theta,
                  ),

                heightRandom *
                  maxVolume *
                  volumeScale,

                r *
                  Math.sin(
                    theta,
                  ),
              ),

            velocity,
          };
        },
      );
    }, [
      cylinderRadius,
      maxVolume,
      volumeScale,
    ]);

  useFrame(() => {
    if (
      !visible ||
      !groupRef.current
    ) {
      return;
    }

    const maxY =
      volume * volumeScale - 0.05;

    const radiusBound =
      cylinderRadius - 0.02;

    const speedMultiplier =
      Math.max(
        0.2,
        1 +
          tempSpikeRef.current *
            10,
      );

    groupRef.current.children.forEach(
      (child, index) => {
        const particle =
          particles[index];

        if (!particle) {
          return;
        }

        particle.velocity
          .normalize()
          .multiplyScalar(
            0.015 *
              speedMultiplier,
          );

        particle.position.add(
          particle.velocity,
        );

        if (
          particle.position.y <
          0.02
        ) {
          particle.position.y =
            0.02;

          particle.velocity.y *=
            -1;
        } else if (
          particle.position.y >
          maxY
        ) {
          particle.position.y =
            maxY;

          particle.velocity.y *=
            -1;
        }

        const distance2D =
          Math.sqrt(
            particle.position.x **
              2 +
              particle.position.z **
                2,
          );

        if (
          distance2D >
          radiusBound
        ) {
          const normal =
            new THREE.Vector3(
              particle.position.x,
              0,
              particle.position.z,
            ).normalize();

          particle.velocity.reflect(
            normal,
          );

          particle.position.x =
            normal.x *
            radiusBound;

          particle.position.z =
            normal.z *
            radiusBound;
        }

        child.position.copy(
          particle.position,
        );
      },
    );
  });

  return (
    <group
      ref={groupRef}
      position={[
        0,
        baseY,
        0,
      ]}
      visible={visible}
    >
      {particles.map(
        (_, index) => (
          <mesh key={index}>
            <sphereGeometry
              args={[
                0.008,
                8,
                8,
              ]}
            />

            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.8}
            />
          </mesh>
        ),
      )}
    </group>
  );
}