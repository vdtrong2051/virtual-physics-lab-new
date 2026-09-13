import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import type {
  JoulePreparationToolId,
} from "../model";

type JoulePreparationSceneProps = {
  assembledToolIds:
    readonly JoulePreparationToolId[];
  dropActive?: boolean;
};

const FLOOR_Y = -2.45;
const LEFT_X = -3;
const RIGHT_X = 3;
const CENTER_X = 0;
const PULLEY_Y = 2.8;

function HintRing({
  visible,
  active,
}: {
  visible: boolean;
  active: boolean;
}) {
  if (!visible) {
    return null;
  }

  const segments = Array.from({
    length: 18,
  });

  return (
    <group position={[0, FLOOR_Y + 0.34, 0]}>
      {segments.map((_, index) => {
        const angle =
          (index / segments.length) *
          Math.PI *
          2;

        const radius = 3.35;

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius,
            ]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.1, 0.025, 0.7]} />
            <meshBasicMaterial
              color={
                active
                  ? "#f59e0b"
                  : "#14b8a6"
              }
              transparent
              opacity={active ? 0.95 : 0.62}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Workbench() {
  return (
    <group>
      <mesh
        position={[0, FLOOR_Y, 0]}
        receiveShadow
      >
        <boxGeometry args={[14, 0.65, 8]} />
        <meshStandardMaterial
          color="#272a30"
          roughness={0.82}
          metalness={0.18}
        />
      </mesh>

      <mesh
        position={[0, FLOOR_Y + 0.34, 0]}
        receiveShadow
      >
        <boxGeometry args={[13.6, 0.04, 7.6]} />
        <meshStandardMaterial
          color="#3b3f47"
          roughness={0.72}
          metalness={0.12}
        />
      </mesh>
    </group>
  );
}

function StandGeometry() {
  return (
    <group>
      {[LEFT_X, RIGHT_X].map((x) => (
        <group key={x}>
          <mesh
            position={[x, FLOOR_Y + 0.46, -0.15]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[1.35, 0.18, 1.45]} />
            <meshStandardMaterial
              color="#1d232b"
              metalness={0.72}
              roughness={0.36}
            />
          </mesh>

          <mesh
            position={[x, 0.42, -0.15]}
            castShadow
          >
            <cylinderGeometry
              args={[0.11, 0.11, 5.9, 24]}
            />
            <meshStandardMaterial
              color="#8e9cac"
              metalness={0.9}
              roughness={0.28}
            />
          </mesh>
        </group>
      ))}

      <mesh
        position={[0, 3.25, -0.15]}
        castShadow
      >
        <boxGeometry args={[6.5, 0.16, 0.18]} />
        <meshStandardMaterial
          color="#7e8a99"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function CalorimeterGeometry() {
  return (
    <group position={[CENTER_X, -1.02, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[1.5, 1.5, 2.8, 48]}
        />
        <meshStandardMaterial
          color="#b9c2cc"
          metalness={0.82}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[0, 1.34, 0]} castShadow>
        <torusGeometry args={[1.35, 0.08, 12, 48]} />
        <meshStandardMaterial
          color="#e5e7eb"
          metalness={0.85}
          roughness={0.18}
        />
      </mesh>

      <mesh position={[0, 1.42, 0]}>
        <cylinderGeometry
          args={[1.28, 1.28, 0.08, 48]}
        />
        <meshStandardMaterial
          color="#111827"
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

function WaterGeometry() {
  return (
    <mesh position={[CENTER_X, -1.15, 0]}>
      <cylinderGeometry
        args={[1.25, 1.25, 1.9, 48]}
      />
      <meshPhysicalMaterial
        color="#38bdf8"
        transparent
        opacity={0.52}
        transmission={0.18}
        roughness={0.08}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}

function PaddleGeometry() {
  const blades = Array.from({
    length: 6,
  });

  return (
    <group position={[CENTER_X, -0.55, 0]}>
      <mesh castShadow>
        <cylinderGeometry
          args={[0.055, 0.055, 4.2, 20]}
        />
        <meshStandardMaterial
          color="#d1d5db"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {blades.map((_, index) => {
        const angle =
          (index / blades.length) *
          Math.PI *
          2;

        const y = -0.9 + (index % 3) * 0.55;

        return (
          <mesh
            key={index}
            position={[0, y, 0]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <boxGeometry args={[1.7, 0.12, 0.18]} />
            <meshStandardMaterial
              color="#e5e7eb"
              metalness={0.86}
              roughness={0.24}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Pulley({ x }: { x: number }) {
  return (
    <group
      position={[x, PULLEY_Y, -0.15]}
      rotation={[0, 0, Math.PI / 2]}
    >
      <mesh castShadow>
        <cylinderGeometry
          args={[0.34, 0.34, 0.18, 32]}
        />
        <meshStandardMaterial
          color="#334155"
          metalness={0.88}
          roughness={0.32}
        />
      </mesh>

      <mesh position={[0, -0.11, 0]}>
        <cylinderGeometry
          args={[0.39, 0.39, 0.035, 32]}
        />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry
          args={[0.39, 0.39, 0.035, 32]}
        />
        <meshStandardMaterial
          color="#64748b"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function WeightStack({ x }: { x: number }) {
  const discs = Array.from({
    length: 4,
  });

  return (
    <group>
      <mesh
        position={[x, 1.7, -0.15]}
        castShadow
      >
        <cylinderGeometry
          args={[0.07, 0.07, 2.0, 16]}
        />
        <meshStandardMaterial
          color="#cbd5e1"
          metalness={0.85}
          roughness={0.24}
        />
      </mesh>

      {discs.map((_, index) => (
        <mesh
          key={index}
          position={[
            x,
            0.55 + index * 0.22,
            -0.15,
          ]}
          castShadow
        >
          <cylinderGeometry
            args={[0.5, 0.5, 0.18, 32]}
          />
          <meshStandardMaterial
            color="#f59e0b"
            metalness={0.72}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function WeightsGeometry() {
  return (
    <group>
      <Pulley x={LEFT_X} />
      <Pulley x={RIGHT_X} />

      <WeightStack x={LEFT_X} />
      <WeightStack x={RIGHT_X} />
    </group>
  );
}

function AssemblyScene({
  assembledToolIds,
  dropActive,
}: JoulePreparationSceneProps) {
  const has = (
    toolId: JoulePreparationToolId,
  ) => assembledToolIds.includes(toolId);

  return (
    <>
      <color attach="background" args={["#050b14"]} />

      <ambientLight intensity={0.7} />

      <directionalLight
        position={[4, 8, 6]}
        intensity={1.25}
        castShadow
      />

      <pointLight
        position={[-4, 3, 3]}
        color="#67e8f9"
        intensity={0.85}
        distance={16}
      />

      <Workbench />

      <HintRing
        visible={
          assembledToolIds.length === 0 ||
          Boolean(dropActive)
        }
        active={Boolean(dropActive)}
      />

      {has("stand") && <StandGeometry />}
      {has("calorimeter") && (
        <CalorimeterGeometry />
      )}
      {has("water") && <WaterGeometry />}
      {has("paddle") && <PaddleGeometry />}
      {has("weights") && <WeightsGeometry />}

      <gridHelper
        args={[14, 14, "#334155", "#172033"]}
        position={[0, FLOOR_Y + 0.35, 0]}
      />

      <OrbitControls
        target={[0, -0.25, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={9}
        maxDistance={18}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.48}
      />
    </>
  );
}

export default function JoulePreparationScene(
  props: JoulePreparationSceneProps,
) {
  return (
    <div className="joule-preparation-scene">
      <Canvas
        camera={{
          position: [0, 2.2, 13.5],
          fov: 45,
        }}
        shadows="percentage"
        dpr={[1, 1.5]}
      >
        <AssemblyScene {...props} />
      </Canvas>
    </div>
  );
}
