import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  ContactShadows,
  Environment,
  Grid,
} from "@react-three/drei";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import {
  dampedPhysicsConfig,
} from "../data";

import {
  calculateDampedDisplacement,
} from "../math/dampedMath";

type DampedSceneProps = {
  isPlaying: boolean;
  damping: number;
  paperSpeed: number;
};

export default function DampedScene({
  isPlaying,
  damping,
  paperSpeed,
}: DampedSceneProps) {
  const timeRef = useRef(0);
  const paperZRef = useRef(0);
  const drawCountRef = useRef(0);

  const pendulumRef =
    useRef<THREE.Group>(null);

  const paperGroupRef =
    useRef<THREE.Group>(null);

  const rollerRef =
    useRef<THREE.Mesh>(null);

  const lineGeometryRef =
    useRef<THREE.BufferGeometry>(null);

  const positionsRef =
    useRef(
      new Float32Array(
        dampedPhysicsConfig.maxTracePoints *
          3,
      ),
    );

  const materials = useMemo(
    () => ({
      metal:
        new THREE.MeshStandardMaterial({
          color: "#94a3b8",
          roughness: 0.2,
          metalness: 0.8,
        }),
      wood:
        new THREE.MeshStandardMaterial({
          color: "#fcd34d",
          roughness: 0.8,
        }),
      bob:
        new THREE.MeshStandardMaterial({
          color: "#ef4444",
          roughness: 0.3,
          metalness: 0.3,
        }),
      paper:
        new THREE.MeshStandardMaterial({
          color: "#ffffff",
          roughness: 1,
        }),
      pen:
        new THREE.MeshStandardMaterial({
          color: "#1d4ed8",
        }),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(materials).forEach(
        (material) => material.dispose(),
      );
    },
    [materials],
  );

  useFrame((_, delta) => {
    if (!isPlaying) {
      return;
    }

    timeRef.current += delta;
    paperZRef.current +=
      delta * paperSpeed;

    if (rollerRef.current) {
      rollerRef.current.rotation.x -=
        (delta * paperSpeed) / 0.2;
    }

    const currentX =
      calculateDampedDisplacement(
        timeRef.current,
        damping,
      );

    const angle = Math.asin(
      currentX /
        dampedPhysicsConfig.pendulumLength,
    );

    if (pendulumRef.current) {
      pendulumRef.current.rotation.z =
        angle;
      pendulumRef.current.scale.y =
        1 / Math.cos(angle);
    }

    if (paperGroupRef.current) {
      paperGroupRef.current.position.z =
        paperZRef.current;
    }

    if (
      drawCountRef.current >=
      dampedPhysicsConfig.maxTracePoints
    ) {
      return;
    }

    const positionIndex =
      drawCountRef.current * 3;

    const positions =
      positionsRef.current;

    positions[positionIndex] = currentX;
    positions[positionIndex + 1] = 0.06;
    positions[positionIndex + 2] =
      -paperZRef.current;

    drawCountRef.current += 1;

    if (lineGeometryRef.current) {
      lineGeometryRef.current.setDrawRange(
        0,
        drawCountRef.current,
      );

      const positionAttribute =
        lineGeometryRef.current.getAttribute(
          "position",
        );

      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />

      <ambientLight intensity={0.6} />

      <Environment preset="apartment" />

      <group>
        <mesh
          position={[-4.5, 4, 0]}
          castShadow
          material={materials.metal}
        >
          <cylinderGeometry
            args={[0.15, 0.15, 8]}
          />
        </mesh>

        <mesh
          position={[-4.5, 0, 0]}
          castShadow
          material={materials.wood}
        >
          <boxGeometry
            args={[1.5, 0.2, 1.5]}
          />
        </mesh>

        <mesh
          position={[0, 8, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          material={materials.metal}
        >
          <cylinderGeometry
            args={[0.1, 0.1, 9]}
          />
        </mesh>
      </group>

      <group
        position={[0, 8, 0]}
        ref={pendulumRef}
      >
        <mesh
          position={[0, -3.4, 0]}
          castShadow
        >
          <cylinderGeometry
            args={[0.015, 0.015, 6.8]}
          />
          <meshStandardMaterial color="#64748b" />
        </mesh>

        <mesh
          position={[0, -6.8, 0]}
          castShadow
          material={materials.bob}
        >
          <sphereGeometry
            args={[0.5, 32, 32]}
          />
        </mesh>

        <mesh
          position={[0, -7.37, 0]}
          castShadow
          material={materials.pen}
        >
          <cylinderGeometry
            args={[0.04, 0.02, 1.14]}
          />
        </mesh>
      </group>

      <group>
        <mesh
          ref={rollerRef}
          position={[0, -0.1, 0]}
          rotation={[0, 0, Math.PI / 2]}
          receiveShadow
          castShadow
          material={materials.metal}
        >
          <cylinderGeometry
            args={[0.2, 0.2, 8.2, 32]}
          />
        </mesh>

        <group ref={paperGroupRef}>
          <mesh
            position={[0, 0, -40]}
            receiveShadow
            material={materials.paper}
          >
            <boxGeometry args={[8, 0.1, 80]} />
          </mesh>

          <Grid
            position={[0, 0.05, -40]}
            args={[8, 80]}
            cellSize={0.5}
            cellThickness={1.5}
            cellColor="#e2e8f0"
            sectionSize={2}
            sectionColor="#cbd5e1"
            fadeDistance={40}
          />

          <line frustumCulled={false}>
            <bufferGeometry
              ref={lineGeometryRef}
            >
              <bufferAttribute
                attach="attributes-position"
                args={[
                  positionsRef.current,
                  3,
                ]}
              />
            </bufferGeometry>

            <lineBasicMaterial
              color="#1d4ed8"
              linewidth={3}
            />
          </line>
        </group>
      </group>

      <ContactShadows
        position={[0, -0.21, 0]}
        opacity={0.4}
        scale={30}
        blur={1.5}
        far={4}
      />
    </group>
  );
}
