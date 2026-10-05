import Button from "../../../components/ui/Button";
import ExperimentWorkspace from "../../../components/experiment/ExperimentWorkspace";
import ForcedMath from "./ForcedMath";
import ForcedSimulation from "../simulation/ForcedSimulation";
import type { ForcedPendulumState, ForcedRuntimeState } from "../model";

function PendulumControl({ title, value, disabled, onChange }: { title: string; value: ForcedPendulumState; disabled: boolean; onChange: (value: ForcedPendulumState) => void }) {
  return <fieldset className="forced-control" disabled={disabled}><legend>{title}</legend>
    <label><span>Dài: {value.length.toFixed(1)}m</span><input type="range" min="2" max="8" step="0.5" value={value.length} onChange={(event) => onChange({ ...value, length: Number(event.target.value) })} /></label>
    <label><span>Vị trí: {value.posX.toFixed(1)}m</span><input type="range" min="-6.5" max="6.5" step="0.5" value={value.posX} onChange={(event) => onChange({ ...value, posX: Number(event.target.value) })} /></label>
  </fieldset>;
}

export default function ForcedPracticePhase({ runtime, workspaceExpanded, onToggleWorkspaceExpanded, onTogglePlayback, onToggleCameraLock, onUpdatePendulum, onBack, onContinue }: {
  runtime: ForcedRuntimeState; workspaceExpanded: boolean; onToggleWorkspaceExpanded: () => void; onTogglePlayback: () => void; onToggleCameraLock: () => void;
  onUpdatePendulum: (key: "driver" | "p1" | "p2" | "p3", value: ForcedPendulumState) => void; onBack: () => void; onContinue: () => void;
}) {
  const labels = (["p1", "p2", "p3"] as const).filter((key) => runtime[key].length === runtime.driver.length).map((key) => key.toUpperCase());
  return <ExperimentWorkspace className="forced-practice" railExpanded={workspaceExpanded} simulation={<>
    <ForcedSimulation runtime={runtime} />
    <Button type="button" className="forced-camera" onClick={onToggleCameraLock}>{runtime.isCameraLocked ? "🔓 Mở khóa" : "🔒 Khóa góc nhìn"}</Button>
    {runtime.isPlaying && labels.length > 0 ? <div className="forced-resonance-alert"><span>🔥</span><div><small>Hiện tượng Cộng hưởng</small><strong>Con lắc {labels.join(", ")} đạt biên độ cực đại!</strong></div></div> : null}
  </>}>
    <aside className="forced-panel">
      <div className="forced-panel__top"><Button type="button" onClick={onTogglePlayback} className={runtime.isPlaying ? "forced-stop" : "forced-start"}>{runtime.isPlaying ? "⏹ Dừng & Reset" : "▶ Thả Con Lắc Đ"}</Button><Button type="button" onClick={onToggleWorkspaceExpanded}>{workspaceExpanded ? "Thu gọn" : "Mở rộng"}</Button></div>
      {runtime.isPlaying ? <p className="forced-panel__warning">* Hãy bấm dừng thí nghiệm để tùy chỉnh thông số</p> : null}
      <small>Nguồn phát động:</small><PendulumControl title="🔴 Con lắc Đ" value={runtime.driver} disabled={runtime.isPlaying} onChange={(value) => onUpdatePendulum("driver", value)} />
      <small>Hệ thống con lắc thử:</small><PendulumControl title="🔵 L1" value={runtime.p1} disabled={runtime.isPlaying} onChange={(value) => onUpdatePendulum("p1", value)} /><PendulumControl title="🟢 L2" value={runtime.p2} disabled={runtime.isPlaying} onChange={(value) => onUpdatePendulum("p2", value)} /><PendulumControl title="🟣 L3" value={runtime.p3} disabled={runtime.isPlaying} onChange={(value) => onUpdatePendulum("p3", value)} />
      <p className="forced-panel__formula"><ForcedMath math="T = 2\\pi\\sqrt{l/g}" /></p>
      <div className="forced-actions"><Button type="button" onClick={onBack}>Quay lại</Button><Button type="button" className="forced-button--primary" onClick={onContinue}>Kết luận →</Button></div>
    </aside>
  </ExperimentWorkspace>;
}
