import {
  useEffect,
  useRef,
  useState,
} from "react";

import Button from "../../../components/ui/Button";
import BoyleGraph from "./BoyleGraph";

import {
  boylePhysicsConfig,
  boylePracticeInstructions,
  boyleUnits,
} from "../data";

import type {
  BoyleRecordMeasurementResult,
} from "../controller";

import type {
  BoyleMeasurement,
  BoyleThermalCondition,
} from "../model";

import BoyleSimulation from "../simulation/BoyleSimulation";

type BoylePracticePhaseProps = {
  volume: number;

  thermalCondition:
    BoyleThermalCondition;

  measurements:
    readonly BoyleMeasurement[];

  workspaceExpanded: boolean;

  onVolumeChange: (
    volume: number,
  ) => void;

  onThermalConditionChange: (
    condition: BoyleThermalCondition,
  ) => void;

  onFirePiston: () => boolean;

  onRecordMeasurement:
    () => BoyleRecordMeasurementResult;

  onClearMeasurements: () => void;

  onToggleWorkspaceExpanded: () => void;

  onContinue: () => void;
};

const AMBIENT_TEMPERATURE = 27;

type RailIconName =
  | "chevron-left"
  | "chevron-right"
  | "expand"
  | "collapse"
  | "book"
  | "clipboard"
  | "chart"
  | "atom"
  | "orbit"
  | "lock"
  | "compress"
  | "thermometer";

function RailIcon({
  name,
}: {
  name: RailIconName;
}) {
  const commonProps = {
    viewBox: "0 0 24 24",
    width: 20,
    height: 20,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap:
      "round" as const,
    strokeLinejoin:
      "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "chevron-left":
      return (
        <svg {...commonProps}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );

    case "chevron-right":
      return (
        <svg {...commonProps}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "expand":
      return (
        <svg {...commonProps}>
          <path d="M8 3H3v5" />
          <path d="m3 3 6 6" />
          <path d="M16 3h5v5" />
          <path d="m21 3-6 6" />
          <path d="M8 21H3v-5" />
          <path d="m3 21 6-6" />
          <path d="M16 21h5v-5" />
          <path d="m21 21-6-6" />
        </svg>
      );

    case "collapse":
      return (
        <svg {...commonProps}>
          <path d="M9 9H4V4" />
          <path d="m4 4 6 6" />

          <path d="M15 9h5V4" />
          <path d="m20 4-6 6" />

          <path d="M9 15H4v5" />
          <path d="m4 20 6-6" />

          <path d="M15 15h5v5" />
          <path d="m20 20-6-6" />
        </svg>
      );

    case "book":
      return (
        <svg {...commonProps}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
          <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21.5Z" />
        </svg>
      );

    case "clipboard":
      return (
        <svg {...commonProps}>
          <rect
            x="5"
            y="4"
            width="14"
            height="17"
            rx="2"
          />
          <path d="M9 4.5V3h6v1.5" />
          <path d="M8 9h8" />
          <path d="M8 13h8" />
          <path d="M8 17h5" />
        </svg>
      );

    case "chart":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 4-4 3 2 5-6" />
        </svg>
      );

    case "atom":
      return (
        <svg {...commonProps}>
          <circle
            cx="12"
            cy="12"
            r="1.3"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9"
            ry="3.6"
            transform="rotate(120 12 12)"
          />
        </svg>
      );

    case "orbit":
      return (
        <svg {...commonProps}>
          <path d="M20 11a8 8 0 1 0-2.3 5.7" />
          <path d="M20 5v6h-6" />
          <circle
            cx="12"
            cy="12"
            r="2"
          />
        </svg>
      );

    case "lock":
      return (
        <svg {...commonProps}>
          <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
          />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "compress":
      return (
        <svg {...commonProps}>
          <path d="M3 12h7" />
          <path d="m7 9 3 3-3 3" />

          <path d="M21 12h-7" />
          <path d="m17 9-3 3 3 3" />

          <path d="M12 5v14" />
        </svg>
      );

    case "thermometer":
      return (
        <svg {...commonProps}>
          <path d="M10 14.8V5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0Z" />
          <path d="M12 12v5" />
        </svg>
      );
  }
}

export default function BoylePracticePhase({
  volume,
  thermalCondition,
  measurements,
  onVolumeChange,
  onThermalConditionChange,
  onFirePiston,
  onRecordMeasurement,
  onClearMeasurements,
  onContinue,
  workspaceExpanded,
  onToggleWorkspaceExpanded,
}: BoylePracticePhaseProps) {
  const [
    showInstructions,
    setShowInstructions,
  ] = useState(true);

  const [
    showMeasurements,
    setShowMeasurements,
  ] = useState(true);

  const [
    showAnalysis,
    setShowAnalysis,
  ] = useState(true);

  const [
    toolRailExpanded,
    setToolRailExpanded,
  ] = useState(false);

  const [
    orbitEnabled,
    setOrbitEnabled,
  ] = useState(true);

  const [
    showParticles,
    setShowParticles,
  ] = useState(false);

  const [
    firePulse,
    setFirePulse,
  ] = useState(0);

  const [
    temperature,
    setTemperature,
  ] = useState(
    AMBIENT_TEMPERATURE,
  );

  const [
    feedback,
    setFeedback,
  ] = useState("");

  const [
    feedbackTone,
    setFeedbackTone,
  ] = useState<
    "success" | "error"
  >("error");

  const [
    showExplosionModal,
    setShowExplosionModal,
  ] = useState(false);

  const feedbackTimerRef =
    useRef<number | null>(null);

  const explosionOpenTimerRef =
    useRef<number | null>(null);

  const explosionCloseTimerRef =
    useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (
        feedbackTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          feedbackTimerRef.current,
        );
      }

      if (
        explosionOpenTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          explosionOpenTimerRef.current,
        );
      }

      if (
        explosionCloseTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          explosionCloseTimerRef.current,
        );
      }
    };
  }, []);

  function showTemporaryFeedback(
    message: string,
    tone: "success" | "error" =
      "error",
  ) {
    setFeedback(message);
    setFeedbackTone(tone);

    if (
      feedbackTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        feedbackTimerRef.current,
      );
    }

    feedbackTimerRef.current =
      window.setTimeout(() => {
        setFeedback("");

        feedbackTimerRef.current =
          null;
      }, 3000);
  }

  function handleRecordMeasurement() {
    const result =
      onRecordMeasurement();

    switch (result) {
      case "recorded": {
        const nextCount =
          measurements.length + 1;

        showTemporaryFeedback(
          `Đã ghi số liệu lần ${nextCount}/${boylePhysicsConfig.targetMeasurementCount}.`,
          "success",
        );

        return;
      }

      case "thermal-transient":
        showTemporaryFeedback(
          "Hệ thống đang tản nhiệt. Hãy chờ khối khí trở lại trạng thái cân bằng rồi mới ghi số liệu.",
        );

        return;

      case "duplicate-volume":
        showTemporaryFeedback(
          "Mức thể tích này đã được ghi. Hãy thay đổi vị trí pít-tông trước khi đo tiếp.",
        );

        return;

      case "limit-reached":
        showTemporaryFeedback(
          "Đã thu thập đủ 5 lần đo cho thí nghiệm.",
          "success",
        );

        return;
    }
  }

  function handleClearMeasurements() {
    if (
      measurements.length === 0
    ) {
      showTemporaryFeedback(
        "Chưa có số liệu để xóa.",
      );

      return;
    }

    onClearMeasurements();

    showTemporaryFeedback(
      "Đã xóa toàn bộ số liệu đo.",
      "success",
    );
  }

  function handleFirePiston() {
    const accepted =
      onFirePiston();

    if (!accepted) {
      showTemporaryFeedback(
        "Khối khí đang ở trạng thái nhiệt chưa cân bằng. Hãy chờ hệ ổn định trước khi ép nhanh lần nữa.",
      );

      return;
    }

    setFirePulse(
      (current) =>
        current + 1,
    );

    if (
      explosionOpenTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        explosionOpenTimerRef.current,
      );
    }

    if (
      explosionCloseTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        explosionCloseTimerRef.current,
      );
    }

    setShowExplosionModal(false);

    explosionOpenTimerRef.current =
      window.setTimeout(() => {
        setShowExplosionModal(true);

        explosionOpenTimerRef.current =
          null;

        explosionCloseTimerRef.current =
          window.setTimeout(() => {
            setShowExplosionModal(
              false,
            );

            explosionCloseTimerRef.current =
              null;
          }, 8000);
      }, 1500);
  }

  const isThermallyStable =
    thermalCondition ===
    "equilibrium";

  const targetMeasurementCount =
    boylePhysicsConfig
      .targetMeasurementCount;

  const measurementCount =
    measurements.length;

  const measurementProgress =
    Math.min(
      measurementCount /
        targetMeasurementCount,
      1,
    );

  const measurementComplete =
    measurementCount >=
    targetMeasurementCount;

  return (
    <div
      className={`boyle-practice ${
        toolRailExpanded
          ? "boyle-practice--rail-expanded"
          : ""
      }`}
    >
      <div className="boyle-practice__simulation">
        <BoyleSimulation
          volume={volume}
          thermalCondition={
            thermalCondition
          }
          showParticles={
            showParticles
          }
          orbitEnabled={
            orbitEnabled
          }
          firePulse={firePulse}
          onVolumeChange={
            onVolumeChange
          }
          onThermalConditionChange={
            onThermalConditionChange
          }
          onTemperatureChange={
            setTemperature
          }
        />
      </div>

      {feedback && (
        <div
          className={`boyle-practice__feedback ${
            feedbackTone ===
            "success"
              ? "boyle-practice__feedback--success"
              : ""
          }`}
          role="status"
        >
          {feedback}
        </div>
      )}

      {showInstructions && (
        <aside className="boyle-practice-panel boyle-practice-panel--instructions">
          <span className="boyle-practice-panel__eyebrow">
            Định luật Boyle-Mariotte
          </span>

          <h3>
            Nén khí đẳng nhiệt
          </h3>

          <ol className="boyle-practice__instructions">
            {boylePracticeInstructions.map(
              (
                instruction,
                index,
              ) => (
                <li key={instruction}>
                  <strong>
                    {index + 1}.
                  </strong>

                  <span>
                    {instruction}
                  </span>
                </li>
              ),
            )}
          </ol>
        </aside>
      )}

      {showMeasurements && (
        <aside className="boyle-practice-panel boyle-practice-panel--measurement">
          <div className="boyle-measurement__header">
            <div>
              <span className="boyle-practice-panel__eyebrow">
                Thu thập số liệu
              </span>

              <h3>
                Bảng đo
              </h3>
            </div>

            <span className="boyle-measurement__count">
              {measurementCount}
              {" / "}
              {targetMeasurementCount}
            </span>
          </div>

          <div className="boyle-measurement__progress">
            <span
              style={{
                transform: `scaleX(${measurementProgress})`,
              }}
            />
          </div>

          <div className="boyle-live-data">
            <div className="boyle-live-data__item">
              <span>
                Thể tích hiện tại
              </span>

              <strong>
                {volume.toFixed(2)}
                {" "}
                {boyleUnits.volume}
              </strong>
            </div>

            <div className="boyle-live-data__item">
              <span>
                Nhiệt độ khí
              </span>

              <strong>
                {temperature.toFixed(
                  1,
                )}
                {" "}
                {boyleUnits.temperature}
              </strong>
            </div>

            <div className="boyle-live-data__item">
              <span>
                Trạng thái
              </span>

              <strong
                className={
                  isThermallyStable
                    ? "boyle-live-data__state boyle-live-data__state--stable"
                    : "boyle-live-data__state boyle-live-data__state--transient"
                }
              >
                {isThermallyStable
                  ? "Sẵn sàng đo"
                  : "Đang tản nhiệt"}
              </strong>
            </div>
          </div>

          <div className="boyle-measurement__actions">
            <Button
              type="button"
              className="experiment-template__button experiment-template__button--primary"
              onClick={
                handleRecordMeasurement
              }
              disabled={
                measurementComplete
              }
            >
              Ghi số liệu
            </Button>

            <Button
              type="button"
              className="experiment-template__button"
              onClick={
                handleClearMeasurements
              }
            >
              Xóa số liệu
            </Button>
          </div>

          <div className="boyle-measurement__table-wrap">
            <table className="boyle-measurement-table">
              <thead>
                <tr>
                  <th scope="col">
                    Lần
                  </th>

                  <th scope="col">
                    V
                  </th>

                  <th scope="col">
                    p
                  </th>

                  <th scope="col">
                    pV
                  </th>
                </tr>
              </thead>

              <tbody>
                {Array.from({
                  length:
                    targetMeasurementCount,
                }).map(
                  (_, index) => {
                    const measurement =
                      measurements[
                        index
                      ];

                    return (
                      <tr
                        key={
                          index
                        }
                      >
                        <th scope="row">
                          {index + 1}
                        </th>

                        <td>
                          {measurement
                            ? measurement.volume.toFixed(
                                2,
                              )
                            : "—"}
                        </td>

                        <td>
                          {measurement
                            ? measurement.pressure.toFixed(
                                3,
                              )
                            : "—"}
                        </td>

                        <td>
                          {measurement
                            ? measurement.pressureVolume.toFixed(
                                3,
                              )
                            : "—"}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>

          <div className="boyle-measurement__units">
            <span>
              V: {boyleUnits.volume}
            </span>

            <span>
              p: {boyleUnits.pressure}
            </span>

            <span>
              pV:{" "}
              {boyleUnits.pressureVolume}
            </span>
          </div>

          {measurementComplete && (
            <div className="boyle-measurement-complete">
              <div className="boyle-measurement-complete__status">
                <span aria-hidden="true">
                  ✓
                </span>

                <div>
                  <strong>
                    Đã hoàn thành thu thập
                  </strong>

                  <span>
                    Đã ghi đủ{" "}
                    {targetMeasurementCount}
                    {" "}
                    mức thể tích.
                  </span>
                </div>
              </div>

              <Button
                type="button"
                className="experiment-template__button experiment-template__button--primary"
                onClick={
                  onContinue
                }
              >
                Tiếp tục sang Kết luận →
              </Button>
            </div>
          )}
        </aside>
      )}

      {showAnalysis && (
        <aside className="boyle-practice-panel boyle-practice-panel--analysis">
          <BoyleGraph
            measurements={measurements}
          />
        </aside>
      )}

      <div
        className={`boyle-practice-rail ${
          toolRailExpanded
            ? "boyle-practice-rail--expanded"
            : ""
        }`}
        aria-label="Công cụ thí nghiệm"
      >
        <Button
          type="button"
          className="boyle-practice-tool boyle-practice-tool--rail-toggle"
          onClick={() =>
            setToolRailExpanded(
              (current) =>
                !current,
            )
          }
          aria-label={
            toolRailExpanded
              ? "Thu gọn thanh công cụ"
              : "Mở rộng thanh công cụ"
          }
          aria-expanded={
            toolRailExpanded
          }
          data-tooltip={
            toolRailExpanded
              ? "Thu gọn"
              : "Mở công cụ"
          }
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon
              name={
                toolRailExpanded
                  ? "chevron-right"
                  : "chevron-left"
              }
            />
          </span>

          <span className="boyle-practice-tool__label">
            Thu gọn
          </span>
        </Button>

        <Button
          type="button"
          className={`boyle-practice-tool ${
            workspaceExpanded
              ? "boyle-practice-tool--active"
              : ""
          }`}
          onClick={
            onToggleWorkspaceExpanded
          }
          aria-pressed={
            workspaceExpanded
          }
          aria-label={
            workspaceExpanded
              ? "Thu nhỏ workspace"
              : "Mở rộng workspace"
          }
          data-tooltip={
            workspaceExpanded
              ? "Thu nhỏ workspace"
              : "Mở rộng workspace"
          }
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon
              name={
                workspaceExpanded
                  ? "collapse"
                  : "expand"
              }
            />
          </span>

          <span className="boyle-practice-tool__label">
            {workspaceExpanded
              ? "Thu nhỏ workspace"
              : "Mở rộng workspace"}
          </span>
        </Button>

        <div
          className="boyle-practice-rail__separator"
          aria-hidden="true"
        />

        <Button
          type="button"
          className={`boyle-practice-tool ${
            showInstructions
              ? "boyle-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            setShowInstructions(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            showInstructions
          }
          aria-label="Ẩn hoặc hiện hướng dẫn"
          data-tooltip="Hướng dẫn"
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon name="book" />
          </span>

          <span className="boyle-practice-tool__label">
            Hướng dẫn
          </span>
        </Button>

        <Button
          type="button"
          className={`boyle-practice-tool ${
            showMeasurements
              ? "boyle-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            setShowMeasurements(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            showMeasurements
          }
          aria-label="Ẩn hoặc hiện bảng số liệu"
          data-tooltip="Thu thập số liệu"
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon name="clipboard" />
          </span>

          <span className="boyle-practice-tool__label">
            Thu thập số liệu
          </span>
        </Button>

        <Button
          type="button"
          className={`boyle-practice-tool ${
            showAnalysis
              ? "boyle-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            setShowAnalysis(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            showAnalysis
          }
          aria-label="Ẩn hoặc hiện phân tích số liệu"
          data-tooltip="Phân tích số liệu"
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon name="chart" />
          </span>

          <span className="boyle-practice-tool__label">
            Phân tích số liệu
          </span>
        </Button>

        <div
          className="boyle-practice-rail__separator"
          aria-hidden="true"
        />

        <Button
          type="button"
          className={`boyle-practice-tool ${
            showParticles
              ? "boyle-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            setShowParticles(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            showParticles
          }
          aria-label="Ẩn hoặc hiện góc nhìn vi mô"
          data-tooltip="Góc nhìn vi mô"
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon name="atom" />
          </span>

          <span className="boyle-practice-tool__label">
            Góc nhìn vi mô
          </span>
        </Button>

        <Button
          type="button"
          className={`boyle-practice-tool ${
            !orbitEnabled
              ? "boyle-practice-tool--locked"
              : ""
          }`}
          onClick={() =>
            setOrbitEnabled(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            !orbitEnabled
          }
          aria-label="Bật hoặc khóa xoay góc nhìn"
          data-tooltip={
            orbitEnabled
              ? "Khóa góc nhìn"
              : "Bật xoay góc nhìn"
          }
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon
              name={
                orbitEnabled
                  ? "orbit"
                  : "lock"
              }
            />
          </span>

          <span className="boyle-practice-tool__label">
            {orbitEnabled
              ? "Khóa góc nhìn"
              : "Bật xoay góc nhìn"}
          </span>
        </Button>

        <Button
          type="button"
          className="boyle-practice-tool boyle-practice-tool--danger"
          onClick={
            handleFirePiston
          }
          aria-label="Ép nhanh pít-tông"
          data-tooltip="Ép nhanh"
        >
          <span className="boyle-practice-tool__icon">
            <RailIcon name="compress" />
          </span>

          <span className="boyle-practice-tool__label">
            Ép nhanh
          </span>
        </Button>
      </div>

      <div className="boyle-practice-temperature boyle-practice-temperature--floating">
        <span className="boyle-practice-temperature__icon">
          <RailIcon name="thermometer" />
        </span>

        <div>
          <span>
            Nhiệt độ
          </span>

          <strong>
            {temperature.toFixed(
              1,
            )}
            °C
          </strong>
        </div>
      </div>

      {showExplosionModal && (
        <div
          className="boyle-fire-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="boyle-fire-title"
        >
          <div className="boyle-fire-modal__icon">
            🔥
          </div>

          <span className="boyle-fire-modal__eyebrow">
            Hiện tượng Pít-tông lửa
          </span>

          <h3 id="boyle-fire-title">
            Nén đoạn nhiệt
          </h3>

          <p>
            Khi khối khí bị nén rất nhanh,
            nó không có đủ thời gian trao đổi
            nhiệt đáng kể với môi trường.
          </p>

          <p>
            Công cơ học thực hiện lên khối khí
            làm nội năng tăng, khiến nhiệt độ
            tăng mạnh trong thời gian ngắn.
          </p>

          <Button
            type="button"
            className="experiment-template__button"
            onClick={() =>
              setShowExplosionModal(
                false,
              )
            }
          >
            Đóng
          </Button>

          <div
            className="boyle-fire-modal__timer"
            aria-hidden="true"
          >
            <span />
          </div>
        </div>
      )}
    </div>
  );
}