import { OrbitControls } from "@react-three/drei";
import ExperimentCanvas from "../../../components/experiment/ExperimentCanvas";
import type { ForcedRuntimeState } from "../model";
import ForcedScene from "./ForcedScene";

export default function ForcedSimulation({ runtime }: { runtime: ForcedRuntimeState }) {
  return <div className="forced-simulation"><ExperimentCanvas camera={{ position: [1.5, 3, 26], fov: 40 }} shadows powerPreference="high-performance">
    <color attach="background" args={["#f8fafc"]} /><fog attach="fog" args={["#f8fafc", 20, 60]} />
    <ForcedScene {...runtime} />
    <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} target={[0, 0, 0]} enableRotate={!runtime.isCameraLocked} enableZoom={!runtime.isCameraLocked} enablePan={!runtime.isCameraLocked} />
  </ExperimentCanvas></div>;
}
