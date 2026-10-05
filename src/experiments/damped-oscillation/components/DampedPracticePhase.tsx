import {
  useEffect,
  useRef,
  useState,
} from "react";

import ExperimentToast from "../../../components/experiment/ExperimentToast";
import ExperimentWorkspace from "../../../components/experiment/ExperimentWorkspace";
import SimulationErrorBoundary from "../../../components/experiment/SimulationErrorBoundary";
import Button from "../../../components/ui/Button";

import {
  dampedPhysicsConfig,
} from "../data";

import type {
  DampedRuntimeState,
  DampedSnapshot,
} from "../model";

import DampedSimulation from "../simulation/DampedSimulation";

import DampedGraph from "./DampedGraph";
import DampedMath from "./DampedMath";

type DampedPracticePhaseProps = {
  runtime: DampedRuntimeState;
  snapshots: readonly DampedSnapshot[];
  showComparison: boolean;
  onDampingChange: (value: number) => void;
  onPaperSpeedChange: (value: number) => void;
  onTogglePlayback: () => void;
  onResetRuntime: () => void;
  onToggleCameraLock: () => void;
  onAddSnapshot: (url: string) => void;
  onClearSnapshots: () => void;
  onOpenComparison: () => void;
  onCloseComparison: () => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function DampedPracticePhase({
  runtime,
  snapshots,
  showComparison,
  onDampingChange,
  onPaperSpeedChange,
  onTogglePlayback,
  onResetRuntime,
  onToggleCameraLock,
  onAddSnapshot,
  onClearSnapshots,
  onOpenComparison,
  onCloseComparison,
  onBack,
  onContinue,
}: DampedPracticePhaseProps) {
  const simulationRef =
    useRef<HTMLDivElement>(null);

  const [captureError, setCaptureError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!showComparison) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onCloseComparison();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [showComparison, onCloseComparison]);

  function captureSnapshot() {
    const canvas =
      simulationRef.current?.querySelector(
        "canvas",
      );

    if (!canvas) {
      setCaptureError(
        "Chưa tìm thấy vùng mô phỏng để chụp ảnh.",
      );
      return;
    }

    try {
      onAddSnapshot(
        canvas.toDataURL("image/png"),
      );
      setCaptureError(null);
    } catch {
      setCaptureError(
        "Không thể chụp ảnh mô phỏng trên thiết bị này.",
      );
    }
  }

  return (
    <>
      {showComparison &&
        snapshots.length > 0 && (
          <DampedComparisonDialog
            snapshots={snapshots}
            onClose={onCloseComparison}
          />
        )}

      <ExperimentWorkspace
        className="damped-practice"
        simulation={
          <div
            ref={simulationRef}
            className={`damped-practice__canvas-wrap ${
              runtime.isCameraLocked
                ? "damped-practice__canvas-wrap--locked"
                : ""
            }`}
          >
            <SimulationErrorBoundary>
              <DampedSimulation
                isPlaying={
                  runtime.isPlaying
                }
                damping={runtime.damping}
                paperSpeed={
                  runtime.paperSpeed
                }
                resetVersion={
                  runtime.resetVersion
                }
                isCameraLocked={
                  runtime.isCameraLocked
                }
              />
            </SimulationErrorBoundary>

            <div className="damped-practice__camera-hint">
              <span aria-hidden="true">
                {runtime.isCameraLocked
                  ? "🔒"
                  : "🖱️"}
              </span>

              {runtime.isCameraLocked
                ? "Góc nhìn đã được cố định"
                : "Giữ chuột để xoay và xem chi tiết đồ thị"}
            </div>

            <Button
              type="button"
              className="damped-practice__camera-button"
              onClick={onToggleCameraLock}
            >
              <span aria-hidden="true">
                {runtime.isCameraLocked
                  ? "🔓"
                  : "🔒"}
              </span>

              {runtime.isCameraLocked
                ? "Mở khóa"
                : "Khóa góc nhìn"}
            </Button>
          </div>
        }
      >
        <aside className="damped-practice__controls">
          <div className="damped-practice__playback">
            <Button
              type="button"
              className={`damped-practice__play ${
                runtime.isPlaying
                  ? "damped-practice__play--paused"
                  : ""
              }`}
              onClick={onTogglePlayback}
            >
              {runtime.isPlaying
                ? "⏸ Tạm dừng"
                : runtime.hasStarted
                  ? "▶ Tiếp tục"
                  : "▶ Bắt đầu"}
            </Button>

            <Button
              type="button"
              className="damped-practice__reset"
              onClick={onResetRuntime}
            >
              ↺ Chạy lại
            </Button>
          </div>

          <section className="damped-practice__parameters">
            <label>
              <span>
                Hệ số lực cản ({
                " "
                }
                <DampedMath math="\\beta" />)

                <b>
                  {runtime.damping.toFixed(2)}
                </b>
              </span>

              <input
                type="range"
                min={
                  dampedPhysicsConfig.dampingMin
                }
                max={
                  dampedPhysicsConfig.dampingMax
                }
                step={
                  dampedPhysicsConfig.dampingStep
                }
                value={runtime.damping}
                disabled={runtime.hasStarted}
                onChange={(event) =>
                  onDampingChange(
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <label>
              <span>
                Tốc độ cuộn giấy ({
                " "
                }
                <DampedMath math="v" />)

                <b>
                  {runtime.paperSpeed.toFixed(1)}{
                  " "
                  }
                  cm/s
                </b>
              </span>

              <input
                type="range"
                min={
                  dampedPhysicsConfig.paperSpeedMin
                }
                max={
                  dampedPhysicsConfig.paperSpeedMax
                }
                step={
                  dampedPhysicsConfig.paperSpeedStep
                }
                value={runtime.paperSpeed}
                disabled={runtime.hasStarted}
                onChange={(event) =>
                  onPaperSpeedChange(
                    Number(event.target.value),
                  )
                }
              />
            </label>
          </section>

          <section className="damped-practice__capture">
            <div className="damped-practice__capture-heading">
              <h3>
                📸 Thu thập dữ liệu ({
                snapshots.length
                }/{
                dampedPhysicsConfig.snapshotLimit
                })
              </h3>

              {snapshots.length > 0 && (
                <Button
                  type="button"
                  onClick={onClearSnapshots}
                >
                  Xóa ảnh
                </Button>
              )}
            </div>

            <Button
              type="button"
              className="damped-practice__capture-button"
              onClick={captureSnapshot}
            >
              Chụp đồ thị hiện tại
            </Button>

            {snapshots.length > 0 && (
              <Button
                type="button"
                className="damped-practice__compare-button"
                onClick={onOpenComparison}
              >
                Mở bảng đối chiếu →
              </Button>
            )}

            {captureError && (
              <ExperimentToast
                className="damped-practice__toast"
                tone="error"
                message={captureError}
              />
            )}
          </section>

          <div className="damped-practice__navigation">
            <Button
              type="button"
              className="damped-button damped-button--secondary"
              onClick={onBack}
            >
              Quay lại
            </Button>

            <Button
              type="button"
              className="damped-button damped-button--blue"
              onClick={onContinue}
            >
              Kết luận →
            </Button>
          </div>
        </aside>
      </ExperimentWorkspace>
    </>
  );
}

type DampedComparisonDialogProps = {
  snapshots: readonly DampedSnapshot[];
  onClose: () => void;
};

function DampedComparisonDialog({
  snapshots,
  onClose,
}: DampedComparisonDialogProps) {
  return (
    <div
      className="damped-comparison"
      role="dialog"
      aria-modal="true"
      aria-labelledby="damped-comparison-title"
    >
      <div className="damped-comparison__panel">
        <header className="damped-comparison__header">
          <h2 id="damped-comparison-title">
            📊 Đối chiếu biên độ dao động tắt dần
          </h2>

          <Button
            type="button"
            onClick={onClose}
            autoFocus
          >
            ✕ Đóng lại
          </Button>
        </header>

        <div className="damped-comparison__grid">
          {snapshots.map(
            (snapshot, index) => (
              <article
                key={snapshot.id}
                className="damped-comparison-card"
              >
                <header>
                  <span>
                    Trường hợp {index + 1}
                  </span>

                  <strong>
                    <DampedMath math="\\beta =" />{
                    " "
                    }
                    {snapshot.damping.toFixed(2)}
                  </strong>
                </header>

                <figure>
                  <span>Góc nhìn 3D</span>

                  <img
                    src={snapshot.url}
                    alt={`Ảnh chụp mô phỏng trường hợp ${index + 1}`}
                  />
                </figure>

                <DampedGraph
                  damping={snapshot.damping}
                />
              </article>
            ),
          )}

          {snapshots.length === 1 && (
            <div className="damped-comparison__placeholder">
              <span aria-hidden="true">📸</span>

              <h3>
                Đang chờ hình ảnh đối chiếu
              </h3>

              <p>
                Hãy đóng bảng này lại, chạy lại mô
                phỏng, thay đổi thanh trượt{
                " "
                }
                <strong>Hệ số lực cản</strong> và
                chụp thêm một bức nữa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
