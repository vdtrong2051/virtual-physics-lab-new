import { ContactShadows, Environment, Grid, Text, Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type * as THREE from "three";

import type { ForcedPendulumState } from "../model";

type PendulumProps = ForcedPendulumState & {
  driverLength: number;
  timeRef: MutableRefObject<number>;
  color: string;
  label: string;
  isDriver?: boolean;
};

function Pendulum({ length, driverLength, timeRef, color, label, isDriver = false }: PendulumProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const t = timeRef.current;
    const gravity = 9.8;
    const beta = 0.15;
    const omegaD = Math.sqrt(gravity / driverLength);
    const omega0 = Math.sqrt(gravity / length);
    let angle: number;
    if (isDriver) {
      angle = 0.6 * Math.cos(omegaD * t);
    } else {
      const deltaOmegaSq = omega0 * omega0 - omegaD * omegaD;
      const amplitude = 0.8 / Math.sqrt(deltaOmegaSq * deltaOmegaSq + 4 * beta * beta * omegaD * omegaD);
      const phase = Math.atan2(2 * beta * omegaD, deltaOmegaSq);
      angle = amplitude * (1 - Math.exp(-beta * t)) * Math.cos(omegaD * t - phase);
    }
    groupRef.current.rotation.z = angle;
    if (textRef.current) textRef.current.rotation.z = -angle;
  });

  return <group ref={groupRef}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.16, 0.015, 16, 32]} /><meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} /></mesh>
    <mesh position={[0, -length / 2, 0]} castShadow><cylinderGeometry args={[0.008, 0.008, length]} /><meshStandardMaterial color="#1e293b" roughness={0.9} /></mesh>
    <group position={[0, -length, 0]}>
      <Trail width={isDriver ? 0.2 : 0.1} color={color} length={1.5} decay={1} attenuation={(value) => value * value}>
        <mesh castShadow><sphereGeometry args={[isDriver ? 0.35 : 0.28, 48, 48]} /><meshStandardMaterial color={color} roughness={0.15} metalness={0.3} clearcoat={0.5} /></mesh>
      </Trail>
      <group ref={textRef} position={[0, -0.65, 0]}><Text fontSize={0.25} color="#0f172a" outlineWidth={0.03} outlineColor="#ffffff">{label}</Text></group>
    </group>
  </group>;
}

export default function ForcedScene({ isPlaying, resetVersion, driver, p1, p2, p3 }: {
  isPlaying: boolean; resetVersion: number; driver: ForcedPendulumState; p1: ForcedPendulumState; p2: ForcedPendulumState; p3: ForcedPendulumState;
}) {
  const timeRef = useRef(0);
  useFrame((_, delta) => { if (isPlaying) timeRef.current += delta; });
  useEffect(() => { timeRef.current = 0; }, [resetVersion]);

  const pendulums = [
    { ...driver, color: "#ef4444", label: `Con lắc Đ (${driver.length.toFixed(1)}m)`, isDriver: true },
    { ...p1, color: "#3b82f6", label: `L1 (${p1.length.toFixed(1)}m)` },
    { ...p2, color: "#10b981", label: `L2 (${p2.length.toFixed(1)}m)` },
    { ...p3, color: "#8b5cf6", label: `L3 (${p3.length.toFixed(1)}m)` },
  ];

  return <group position={[0, 4, 0]}>
    <directionalLight position={[15, 20, 15]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
    <directionalLight position={[-10, 10, -10]} intensity={0.5} /><ambientLight intensity={0.6} /><Environment preset="city" />
    {[-7.5, 7.5].map((x) => <group key={x}><mesh position={[x, -4, 0]} castShadow><cylinderGeometry args={[0.15, 0.15, 8]} /><meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} /></mesh><mesh position={[x, -8, 0]} castShadow receiveShadow><boxGeometry args={[3, 0.2, 3]} /><meshStandardMaterial color="#475569" roughness={0.8} /></mesh></group>)}
    <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.15, 0.15, 15]} /><meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} /></mesh>
    {pendulums.map((pendulum) => <group key={pendulum.label} position={[pendulum.posX, 0, 0]}><Pendulum {...pendulum} driverLength={driver.length} timeRef={timeRef} /></group>)}
    <mesh position={[0, -8.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[50, 30]} /><meshStandardMaterial color="#f8fafc" roughness={1} /></mesh>
    <Grid position={[0, -8.09, 0]} args={[50, 30]} cellSize={1} cellThickness={1.5} cellColor="#e2e8f0" sectionSize={5} sectionColor="#cbd5e1" fadeDistance={30} />
    <ContactShadows position={[0, -8.08, 0]} opacity={0.4} scale={40} blur={2} far={10} color="#0f172a" />
  </group>;
}
