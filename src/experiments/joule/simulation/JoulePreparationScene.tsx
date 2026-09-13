import {
  Canvas,
} from "@react-three/fiber";

import {
  OrbitControls,
} from "@react-three/drei";

import * as THREE from "three";

import type {
  JoulePreparationToolId,
} from "../model";

type JoulePreparationSceneProps = {
  assembledToolIds:
    readonly JoulePreparationToolId[];

  dropActive?: boolean;
};

const FLOOR_Y = -2.65;

const LEFT_X = -3.2;
const RIGHT_X = 3.2;
const CENTER_X = 0;

const PULLEY_Y = 2.95;

const VESSEL_Y = -1.02;
const VESSEL_RADIUS = 1.48;
const VESSEL_HEIGHT = 3;

const DRUM_RADIUS = 0.44;

/* =========================================================
   ASSEMBLY HINT
   ========================================================= */

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

  const segments =
    Array.from({
      length: 24,
    });

  return (
    <group
      position={[
        0,
        FLOOR_Y + 0.38,
        0,
      ]}
    >
      {segments.map(
        (_, index) => {
          const angle =
            (
              index /
              segments.length
            ) *
            Math.PI *
            2;

          const radius = 3.65;

          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) *
                  radius,
                0,
                Math.sin(angle) *
                  radius,
              ]}
              rotation={[
                0,
                -angle,
                0,
              ]}
            >
              <boxGeometry
                args={[
                  0.08,
                  0.022,
                  0.45,
                ]}
              />

              <meshBasicMaterial
                color={
                  active
                    ? "#f59e0b"
                    : "#2dd4bf"
                }
                transparent
                opacity={
                  active
                    ? 0.92
                    : 0.5
                }
              />
            </mesh>
          );
        },
      )}
    </group>
  );
}

/* =========================================================
   WORKBENCH
   ========================================================= */

function Workbench() {
  return (
    <group>
      <mesh
        position={[
          0,
          FLOOR_Y - 0.22,
          0,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[
            14,
            0.55,
            8,
          ]}
        />

        <meshStandardMaterial
          color="#211a16"
          roughness={0.78}
          metalness={0.08}
        />
      </mesh>

      <mesh
        position={[
          0,
          FLOOR_Y + 0.07,
          0,
        ]}
        receiveShadow
      >
        <boxGeometry
          args={[
            13.7,
            0.05,
            7.7,
          ]}
        />

        <meshStandardMaterial
          color="#3a2c23"
          roughness={0.68}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   SUPPORT FRAME
   ========================================================= */

function SupportFoot({
  x,
}: {
  x: number;
}) {
  return (
    <group>
      <mesh
        position={[
          x,
          FLOOR_Y + 0.18,
          -0.15,
        ]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            1.45,
            0.18,
            1.45,
          ]}
        />

        <meshStandardMaterial
          color="#1c232b"
          metalness={0.72}
          roughness={0.38}
        />
      </mesh>

      <mesh
        position={[
          x,
          0.28,
          -0.15,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.115,
            0.115,
            5.75,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#7c8a99"
          metalness={0.9}
          roughness={0.26}
        />
      </mesh>
    </group>
  );
}

function StandGeometry() {
  return (
    <group>
      <SupportFoot
        x={LEFT_X}
      />

      <SupportFoot
        x={RIGHT_X}
      />

      {/* Dầm ngang chính */}
      <mesh
        position={[
          0,
          3.23,
          -0.15,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            7,
            0.18,
            0.22,
          ]}
        />

        <meshStandardMaterial
          color="#697887"
          metalness={0.92}
          roughness={0.28}
        />
      </mesh>

      {/* Gối đỡ trục trung tâm */}
      <mesh
        position={[
          0,
          3.03,
          -0.02,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            0.72,
            0.42,
            0.52,
          ]}
        />

        <meshStandardMaterial
          color="#27313c"
          metalness={0.88}
          roughness={0.28}
        />
      </mesh>

      <mesh
        position={[
          0,
          3.03,
          0,
        ]}
        rotation={[
          Math.PI / 2,
          0,
          0,
        ]}
      >
        <torusGeometry
          args={[
            0.16,
            0.045,
            12,
            30,
          ]}
        />

        <meshStandardMaterial
          color="#aab4bf"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   CALORIMETER
   ========================================================= */

function StationaryVanes() {
  const levels = [
    -0.7,
    -0.05,
    0.6,
  ];

  return (
    <group>
      {levels.map(
        (y, levelIndex) => (
          <group
            key={levelIndex}
            position={[
              0,
              y,
              0,
            ]}
          >
            {[0, 1, 2, 3].map(
              (index) => {
                const angle =
                  index *
                  Math.PI /
                  2;

                const radius =
                  0.98;

                return (
                  <mesh
                    key={index}
                    position={[
                      Math.cos(
                        angle,
                      ) *
                        radius,
                      0,
                      Math.sin(
                        angle,
                      ) *
                        radius,
                    ]}
                    rotation={[
                      0,
                      -angle,
                      0,
                    ]}
                    castShadow
                  >
                    <boxGeometry
                      args={[
                        0.62,
                        0.12,
                        0.16,
                      ]}
                    />

                    <meshStandardMaterial
                      color="#a86d32"
                      metalness={0.8}
                      roughness={0.3}
                    />
                  </mesh>
                );
              },
            )}
          </group>
        ),
      )}
    </group>
  );
}

function CalorimeterGeometry() {
  return (
    <group
      position={[
        CENTER_X,
        VESSEL_Y,
        0,
      ]}
    >
      {/*
       * Vỏ đồng dạng cutaway:
       * chừa một phần phía trước để học sinh
       * nhìn thấy vane + paddle ở bên trong.
       */}
      <mesh
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[
            VESSEL_RADIUS,
            VESSEL_RADIUS,
            VESSEL_HEIGHT,
            64,
            1,
            true,
            Math.PI * 0.18,
            Math.PI * 1.64,
          ]}
        />

        <meshStandardMaterial
          color="#a9632c"
          metalness={0.78}
          roughness={0.3}
          side={
            THREE.DoubleSide
          }
        />
      </mesh>

      {/* Đáy bình */}
      <mesh
        position={[
          0,
          -VESSEL_HEIGHT / 2,
          0,
        ]}
        receiveShadow
      >
        <cylinderGeometry
          args={[
            VESSEL_RADIUS,
            VESSEL_RADIUS,
            0.1,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#895025"
          metalness={0.76}
          roughness={0.34}
        />
      </mesh>

      {/* Vành trên */}
      <mesh
        position={[
          0,
          VESSEL_HEIGHT / 2,
          0,
        ]}
      >
        <torusGeometry
          args={[
            1.43,
            0.07,
            14,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#d09352"
          metalness={0.86}
          roughness={0.22}
        />
      </mesh>

      {/* Nắp calorimeter */}
      <mesh
        position={[
          0,
          1.54,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            1.38,
            1.38,
            0.1,
            64,
          ]}
        />

        <meshStandardMaterial
          color="#b87333"
          metalness={0.82}
          roughness={0.26}
        />
      </mesh>

      {/* Cổ trục */}
      <mesh
        position={[
          0,
          1.64,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.16,
            0.16,
            0.18,
            30,
          ]}
        />

        <meshStandardMaterial
          color="#7c8794"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      <StationaryVanes />
    </group>
  );
}

/* =========================================================
   WATER
   ========================================================= */

function WaterGeometry() {
  return (
    <group
      position={[
        CENTER_X,
        VESSEL_Y - 0.14,
        0,
      ]}
    >
      <mesh>
        <cylinderGeometry
          args={[
            1.31,
            1.31,
            2.38,
            64,
          ]}
        />

        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.36}
          transmission={0.18}
          roughness={0.12}
          metalness={0}
          depthWrite={false}
        />
      </mesh>

      {/* Mặt nước */}
      <mesh
        position={[
          0,
          1.19,
          0,
        ]}
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
      >
        <circleGeometry
          args={[
            1.3,
            64,
          ]}
        />

        <meshPhysicalMaterial
          color="#7dd3fc"
          transparent
          opacity={0.4}
          roughness={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   PADDLE WHEEL
   ========================================================= */

function PaddleLevel({
  y,
  rotationY,
}: {
  y: number;
  rotationY: number;
}) {
  return (
    <group
      position={[
        0,
        y,
        0,
      ]}
      rotation={[
        0,
        rotationY,
        0,
      ]}
    >
      <mesh castShadow>
        <boxGeometry
          args={[
            1.65,
            0.12,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color="#d6b06e"
          metalness={0.84}
          roughness={0.24}
        />
      </mesh>

      <mesh
        rotation={[
          0,
          Math.PI / 2,
          0,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            1.65,
            0.12,
            0.18,
          ]}
        />

        <meshStandardMaterial
          color="#d6b06e"
          metalness={0.84}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function PaddleGeometry() {
  return (
    <group>
      {/* Spindle chính */}
      <mesh
        position={[
          CENTER_X,
          0.22,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            0.065,
            0.065,
            5.55,
            26,
          ]}
        />

        <meshStandardMaterial
          color="#c7d0da"
          metalness={0.94}
          roughness={0.18}
        />
      </mesh>

      <group
        position={[
          CENTER_X,
          VESSEL_Y,
          0,
        ]}
      >
        <PaddleLevel
          y={-0.78}
          rotationY={0}
        />

        <PaddleLevel
          y={-0.18}
          rotationY={
            Math.PI / 4
          }
        />

        <PaddleLevel
          y={0.42}
          rotationY={0}
        />

        <PaddleLevel
          y={1.02}
          rotationY={
            Math.PI / 4
          }
        />
      </group>
    </group>
  );
}

/* =========================================================
   DRIVE SYSTEM
   ========================================================= */

function Pulley({
  x,
}: {
  x: number;
}) {
  return (
    <group
      position={[
        x,
        PULLEY_Y,
        0,
      ]}
      rotation={[
        Math.PI / 2,
        0,
        0,
      ]}
    >
      <mesh castShadow>
        <cylinderGeometry
          args={[
            0.34,
            0.34,
            0.18,
            36,
          ]}
        />

        <meshStandardMaterial
          color="#273444"
          metalness={0.88}
          roughness={0.3}
        />
      </mesh>

      <mesh
        position={[
          0,
          -0.115,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.39,
            0.39,
            0.035,
            36,
          ]}
        />

        <meshStandardMaterial
          color="#8493a5"
          metalness={0.92}
          roughness={0.24}
        />
      </mesh>

      <mesh
        position={[
          0,
          0.115,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            0.39,
            0.39,
            0.035,
            36,
          ]}
        />

        <meshStandardMaterial
          color="#8493a5"
          metalness={0.92}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function VerticalRope({
  x,
  bottomY,
}: {
  x: number;
  bottomY: number;
}) {
  const length =
    PULLEY_Y - bottomY;

  return (
    <mesh
      position={[
        x,
        bottomY +
          length / 2,
        0,
      ]}
    >
      <cylinderGeometry
        args={[
          0.022,
          0.022,
          length,
          12,
        ]}
      />

      <meshStandardMaterial
        color="#b8c1cc"
        roughness={0.64}
      />
    </mesh>
  );
}

function HorizontalRope({
  startX,
  endX,
}: {
  startX: number;
  endX: number;
}) {
  const length =
    Math.abs(
      endX - startX,
    );

  return (
    <mesh
      position={[
        (
          startX +
          endX
        ) / 2,
        PULLEY_Y,
        0,
      ]}
      rotation={[
        0,
        0,
        Math.PI / 2,
      ]}
    >
      <cylinderGeometry
        args={[
          0.022,
          0.022,
          length,
          12,
        ]}
      />

      <meshStandardMaterial
        color="#b8c1cc"
        roughness={0.64}
      />
    </mesh>
  );
}

function WeightStack({
  x,
}: {
  x: number;
}) {
  const discs =
    Array.from({
      length: 4,
    });

  return (
    <group
      position={[
        x,
        0.45,
        0,
      ]}
    >
      {/* Móc */}
      <mesh
        position={[
          0,
          0.64,
          0,
        ]}
      >
        <torusGeometry
          args={[
            0.13,
            0.034,
            12,
            28,
          ]}
        />

        <meshStandardMaterial
          color="#b87333"
          metalness={0.9}
          roughness={0.24}
        />
      </mesh>

      {discs.map(
        (_, index) => (
          <mesh
            key={index}
            position={[
              0,
              index * 0.23,
              0,
            ]}
            castShadow
          >
            <cylinderGeometry
              args={[
                0.48,
                0.48,
                0.19,
                36,
              ]}
            />

            <meshStandardMaterial
              color="#8f5428"
              metalness={0.78}
              roughness={0.3}
            />
          </mesh>
        ),
      )}
    </group>
  );
}

function DriveDrum() {
  return (
    <group>
      <mesh
        position={[
          0,
          PULLEY_Y,
          0,
        ]}
        castShadow
      >
        <cylinderGeometry
          args={[
            DRUM_RADIUS,
            DRUM_RADIUS,
            0.46,
            40,
          ]}
        />

        <meshStandardMaterial
          color="#4b5968"
          metalness={0.9}
          roughness={0.24}
        />
      </mesh>

      <mesh
        position={[
          0,
          PULLEY_Y - 0.27,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            DRUM_RADIUS + 0.07,
            DRUM_RADIUS + 0.07,
            0.05,
            40,
          ]}
        />

        <meshStandardMaterial
          color="#a6b0bb"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[
          0,
          PULLEY_Y + 0.27,
          0,
        ]}
      >
        <cylinderGeometry
          args={[
            DRUM_RADIUS + 0.07,
            DRUM_RADIUS + 0.07,
            0.05,
            40,
          ]}
        />

        <meshStandardMaterial
          color="#a6b0bb"
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function WeightsGeometry() {
  const ropeBottomY =
    1.06;

  return (
    <group>
      <Pulley
        x={LEFT_X}
      />

      <Pulley
        x={RIGHT_X}
      />

      <DriveDrum />

      <HorizontalRope
        startX={
          LEFT_X + 0.34
        }
        endX={
          -DRUM_RADIUS
        }
      />

      <HorizontalRope
        startX={
          DRUM_RADIUS
        }
        endX={
          RIGHT_X - 0.34
        }
      />

      <VerticalRope
        x={LEFT_X}
        bottomY={ropeBottomY}
      />

      <VerticalRope
        x={RIGHT_X}
        bottomY={ropeBottomY}
      />

      <WeightStack
        x={LEFT_X}
      />

      <WeightStack
        x={RIGHT_X}
      />
    </group>
  );
}

/* =========================================================
   THERMOMETER
   ========================================================= */

function ThermometerGeometry() {
  return (
    <group
      position={[
        0.92,
        -0.2,
        0.25,
      ]}
    >
      <mesh>
        <cylinderGeometry
          args={[
            0.045,
            0.045,
            2.8,
            18,
          ]}
        />

        <meshPhysicalMaterial
          color="#e2e8f0"
          transparent
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>

      <mesh
        position={[
          0,
          -1.18,
          0,
        ]}
      >
        <sphereGeometry
          args={[
            0.1,
            20,
            20,
          ]}
        />

        <meshStandardMaterial
          color="#dc2626"
          emissive="#7f1d1d"
          emissiveIntensity={0.28}
        />
      </mesh>
    </group>
  );
}

/* =========================================================
   ASSEMBLY SCENE
   ========================================================= */

function AssemblyScene({
  assembledToolIds,
  dropActive,
}: JoulePreparationSceneProps) {
  const has = (
    toolId:
      JoulePreparationToolId,
  ) =>
    assembledToolIds.includes(
      toolId,
    );

  return (
    <>
      <color
        attach="background"
        args={[
          "#08111f",
        ]}
      />

      <ambientLight
        intensity={0.38}
      />

      <hemisphereLight
        color="#dbeafe"
        groundColor="#211711"
        intensity={0.82}
      />

      <directionalLight
        castShadow
        position={[
          6.5,
          10,
          7.5,
        ]}
        color="#fff7ed"
        intensity={2.25}
        shadow-mapSize-width={
          2048
        }
        shadow-mapSize-height={
          2048
        }
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-6}
      />

      <directionalLight
        position={[
          -5.5,
          4.5,
          6,
        ]}
        color="#bfdbfe"
        intensity={0.68}
      />

      <pointLight
        position={[
          0,
          2.5,
          6,
        ]}
        intensity={0.58}
        distance={14}
        decay={2}
      />

      <Workbench />

      <HintRing
        visible={
          assembledToolIds
            .length === 0 ||
          Boolean(
            dropActive,
          )
        }
        active={
          Boolean(
            dropActive,
          )
        }
      />

      {has("stand") && (
        <StandGeometry />
      )}

      {has(
        "calorimeter",
      ) && (
        <>
          <CalorimeterGeometry />

          <ThermometerGeometry />
        </>
      )}

      {has("water") && (
        <WaterGeometry />
      )}

      {has("paddle") && (
        <PaddleGeometry />
      )}

      {has("weights") && (
        <WeightsGeometry />
      )}

      <OrbitControls
        target={[
          0,
          0.15,
          0,
        ]}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        minDistance={9}
        maxDistance={17}
        minPolarAngle={
          Math.PI * 0.2
        }
        maxPolarAngle={
          Math.PI * 0.48
        }
        minAzimuthAngle={
          -Math.PI * 0.42
        }
        maxAzimuthAngle={
          Math.PI * 0.42
        }
      />
    </>
  );
}

/* =========================================================
   CANVAS
   ========================================================= */

export default function JoulePreparationScene(
  props:
    JoulePreparationSceneProps,
) {
  return (
    <div className="joule-preparation-scene">
      <Canvas
        camera={{
          position: [
            4.8,
            4.2,
            12.8,
          ],
          fov: 42,
          near: 0.1,
          far: 100,
        }}
        shadows="percentage"
        dpr={[
          1,
          1.5,
        ]}
        gl={{
          antialias: true,

          toneMapping:
            THREE.ACESFilmicToneMapping,

          powerPreference:
            "high-performance",
        }}
        onCreated={({
          gl,
        }) => {
          gl.toneMappingExposure =
            1.08;
        }}
      >
        <AssemblyScene
          {...props}
        />
      </Canvas>
    </div>
  );
}