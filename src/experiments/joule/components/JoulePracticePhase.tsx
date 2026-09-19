import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ExperimentWorkspace from "../../../components/experiment/ExperimentWorkspace";
import ExperimentToast from "../../../components/experiment/ExperimentToast";
import SimulationErrorBoundary from "../../../components/experiment/SimulationErrorBoundary";
import Button from "../../../components/ui/Button";

import JouleGraph from "./JouleGraph";

import type {
  JouleTemperaturePoint,
} from "./JouleGraph";

import {
  joulePhysicsConfig,
  jouleUnits,
} from "../data";

import type {
  JouleRecordMeasurementResult,
} from "../controller";

import {
  calculateAbsoluteError,
  calculateMeanMechanicalEquivalent,
  calculateMeasurementHeatCalories,
  calculateMeasurementMechanicalEquivalent,
  calculateRelativeErrorPercent,
} from "../math/jouleMath";

import type {
  JouleMeasurement,
  JouleMotionPhase,
} from "../model";

import JouleSimulation from "../simulation/JouleSimulation";

import type {
  JouleSimulationTelemetry,
} from "../simulation/JouleSimulation";

type JoulePracticePanel =
  | "setup"
  | "energy"
  | "measurements"
  | "graph";

type JoulePracticePhaseProps = {
  massPerSideKg: number;
  dropHeightM: number;
  motionPhase: JouleMotionPhase;

  measurements:
    readonly JouleMeasurement[];

  onMassPerSideChange: (
    massPerSideKg: number,
  ) => boolean;

  onDropHeightChange: (
    dropHeightM: number,
  ) => boolean;

  onMotionPhaseChange: (
    phase: JouleMotionPhase,
  ) => void;

  onRecordMeasurement: (
    temperatureRiseC: number,
  ) => JouleRecordMeasurementResult;

  onClearMeasurements: () => void;

  onResetRuntime: () => void;

  workspaceExpanded: boolean;
  onToggleWorkspaceExpanded: () => void;
};

type FeedbackTone =
  | "success"
  | "error"
  | "info";

type FeedbackState = {
  tone: FeedbackTone;
  message: string;
};

const FEEDBACK_AUTO_HIDE_MS = 3000;

type RailIconName =
  | "chevron-left"
  | "chevron-right"
  | "expand"
  | "collapse"
  | "settings"
  | "energy"
  | "clipboard"
  | "chart"
  | "orbit"
  | "lock"
  | "slow";

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

    case "settings":
      return (
        <svg {...commonProps}>
          <circle
            cx="12"
            cy="12"
            r="3"
          />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1L7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z" />
        </svg>
      );

    case "energy":
      return (
        <svg {...commonProps}>
          <path d="M13 2 5 13h6l-1 9 8-12h-6Z" />
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

    case "slow":
      return (
        <svg {...commonProps}>
          <circle
            cx="12"
            cy="12"
            r="9"
          />
          <path d="M12 7v5l3 2" />
          <path d="M7.5 4.5 5.5 2.5" />
        </svg>
      );
  }
}

function getMotionPhaseLabel(
  motionPhase: JouleMotionPhase,
) {
  switch (motionPhase) {
    case "idle":
      return "Sẵn sàng";

    case "falling":
      return "Tạ đang rơi";

    case "spinning":
      return "Cánh khuấy đang quay";

    case "finished":
      return "Đã hoàn thành";
  }
}

export default function JoulePracticePhase({
  massPerSideKg,
  dropHeightM,
  motionPhase,
  measurements,
  onMassPerSideChange,
  onDropHeightChange,
  onMotionPhaseChange,
  onRecordMeasurement,
  onClearMeasurements,
  onResetRuntime,
  workspaceExpanded = false,
  onToggleWorkspaceExpanded,
}: JoulePracticePhaseProps) {
  const [
    telemetry,
    setTelemetry,
  ] = useState<
    JouleSimulationTelemetry | null
  >(null);

  const [
    maxDropHeightM,
    setMaxDropHeightM,
  ] = useState<number>(
    joulePhysicsConfig
      .dropHeightDefaultM,
  );

  const [
    orbitEnabled,
    setOrbitEnabled,
  ] = useState(true);

  const [
    slowMotion,
    setSlowMotion,
  ] = useState(false);

  const [
    feedback,
    setFeedback,
  ] = useState<
    FeedbackState | null
  >(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setFeedback(null);
      }, FEEDBACK_AUTO_HIDE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [feedback]);

  const [
    temperaturePoints,
    setTemperaturePoints,
  ] = useState<
    JouleTemperaturePoint[]
  >([]);

  const [
    activePanel,
    setActivePanel,
  ] = useState<
    JoulePracticePanel | null
  >(null);

  const [
    toolRailExpanded,
    setToolRailExpanded,
  ] = useState(false);

  const recordedCurrentRunRef =
    useRef(false);

  const finalGraphPointRecordedRef =
    useRef(false);

  const targetMeasurementCount =
    joulePhysicsConfig
      .targetMeasurementCount;

  const measurementCount =
    measurements.length;

  const measurementComplete =
    measurementCount >=
    targetMeasurementCount;

  const measurementProgress =
    Math.min(
      measurementCount /
        targetMeasurementCount,
      1,
    );

  const controlsLocked =
    motionPhase !== "idle";

  const setupLocked =
    controlsLocked ||
    measurementComplete;

  const totalMassKg =
    massPerSideKg * 2;

  const expectedMechanicalWorkJ =
    totalMassKg *
    joulePhysicsConfig
      .gravityMPerS2 *
    dropHeightM;

  const measurementResults =
    useMemo(
      () =>
        measurements.map(
          (measurement) => {
            const heatCalories =
              calculateMeasurementHeatCalories(
                measurement,
                joulePhysicsConfig
                  .waterMassKg,
                joulePhysicsConfig
                  .waterSpecificHeatCalPerKgC,
              );

            const mechanicalEquivalent =
              calculateMeasurementMechanicalEquivalent(
                measurement,
                joulePhysicsConfig
                  .gravityMPerS2,
                joulePhysicsConfig
                  .waterMassKg,
                joulePhysicsConfig
                  .waterSpecificHeatCalPerKgC,
              );

            const absoluteError =
              calculateAbsoluteError(
                mechanicalEquivalent,
                joulePhysicsConfig
                  .standardMechanicalEquivalentJPerCal,
              );

            return {
              measurement,
              heatCalories,
              mechanicalEquivalent,
              absoluteError,
            };
          },
        ),
      [measurements],
    );

  const meanMechanicalEquivalent =
    useMemo(
      () =>
        calculateMeanMechanicalEquivalent(
          measurements,
          joulePhysicsConfig
            .gravityMPerS2,
          joulePhysicsConfig
            .waterMassKg,
          joulePhysicsConfig
            .waterSpecificHeatCalPerKgC,
        ),
      [measurements],
    );

  const meanAbsoluteError =
    meanMechanicalEquivalent ===
    null
      ? null
      : calculateAbsoluteError(
          meanMechanicalEquivalent,
          joulePhysicsConfig
            .standardMechanicalEquivalentJPerCal,
        );

  const meanRelativeErrorPercent =
    meanMechanicalEquivalent ===
    null
      ? null
      : calculateRelativeErrorPercent(
          meanMechanicalEquivalent,
          joulePhysicsConfig
            .standardMechanicalEquivalentJPerCal,
        );

  function togglePanel(
    panel: JoulePracticePanel,
  ) {
    setActivePanel(
      (current) =>
        current === panel
          ? null
          : panel,
    );
  }

  function appendTemperaturePoint(
    point: JouleTemperaturePoint,
  ) {
    setTemperaturePoints(
      (current) => {
        const lastPoint =
          current[
            current.length - 1
          ];

        if (
          lastPoint &&
          Math.abs(
            lastPoint.timeS -
              point.timeS,
          ) < 0.000001 &&
          Math.abs(
            lastPoint.temperatureC -
              point.temperatureC,
          ) < 0.000001
        ) {
          return current;
        }

        return [
          ...current,
          point,
        ];
      },
    );
  }

  function handleMotionPhaseChange(
    nextPhase: JouleMotionPhase,
  ) {
    if (nextPhase === "falling") {
      recordedCurrentRunRef.current =
        false;

      finalGraphPointRecordedRef.current =
        false;

      setTemperaturePoints([
        {
          timeS: 0,
          temperatureC:
            joulePhysicsConfig
              .initialTemperatureC,
        },
      ]);

      setFeedback(null);

      /*
       * Khi bắt đầu chạy, trả diện tích
       * về cho apparatus thay vì để panel
       * che vùng kéo/thả tạ.
       */
      setActivePanel(null);
    }

    if (nextPhase === "idle") {
      recordedCurrentRunRef.current =
        false;

      finalGraphPointRecordedRef.current =
        false;

      setTemperaturePoints([]);
    }

    onMotionPhaseChange(
      nextPhase,
    );
  }

  function handleTelemetryChange(
    nextTelemetry:
      JouleSimulationTelemetry,
  ) {
    setTelemetry(
      nextTelemetry,
    );

    if (
      motionPhase === "falling" ||
      motionPhase === "spinning"
    ) {
      appendTemperaturePoint({
        timeS:
          Number(
            nextTelemetry
              .elapsedTimeS
              .toFixed(2),
          ),

        temperatureC:
          nextTelemetry
            .temperatureC,
      });

      return;
    }

    if (
      motionPhase !== "finished"
    ) {
      return;
    }

    if (
      !finalGraphPointRecordedRef.current
    ) {
      finalGraphPointRecordedRef.current =
        true;

      appendTemperaturePoint({
        timeS:
          Number(
            nextTelemetry
              .elapsedTimeS
              .toFixed(2),
          ),

        temperatureC:
          nextTelemetry
            .temperatureC,
      });
    }

    if (
      recordedCurrentRunRef.current
    ) {
      return;
    }

    const toleranceJ =
      Math.max(
        0.001,

        expectedMechanicalWorkJ *
          0.001,
      );

    const finalHeatReached =
      Math.abs(
        nextTelemetry
          .heatEnergyJ -
          expectedMechanicalWorkJ,
      ) <= toleranceJ;

    if (
      !finalHeatReached
    ) {
      return;
    }

    const result =
      onRecordMeasurement(
        nextTelemetry
          .temperatureRiseC,
      );

    if (
      result === "recorded"
    ) {
      recordedCurrentRunRef.current =
        true;

      setFeedback({
        tone: "success",
        message:
          `Đã tự động ghi lần đo ${measurementCount + 1}/${targetMeasurementCount}.`,
      });

      return;
    }

    if (
      result === "limit-reached"
    ) {
      recordedCurrentRunRef.current =
        true;

      setFeedback({
        tone: "info",
        message:
          "Đã thu thập đủ 5 lần đo.",
      });

      return;
    }

    setFeedback({
      tone: "error",
      message:
        "Chưa thể ghi số liệu vì lần chạy chưa kết thúc hợp lệ.",
    });
  }

  function changeMass(
    direction: -1 | 1,
  ) {
    if (
      setupLocked
    ) {
      return;
    }

    const nextMass =
      massPerSideKg +
      direction *
        joulePhysicsConfig
          .massPerSideStepKg;

    const accepted =
      onMassPerSideChange(
        Number(
          nextMass.toFixed(
            1,
          ),
        ),
      );

    if (
      !accepted
    ) {
      return;
    }

    setFeedback(null);
  }

  function handleStart() {
    if (
      controlsLocked ||
      measurementComplete
    ) {
      return;
    }

    setFeedback(null);

    handleMotionPhaseChange(
      "falling",
    );
  }

  function handleResetRuntime() {
    onResetRuntime();

    recordedCurrentRunRef.current =
      false;

    finalGraphPointRecordedRef.current =
      false;

    setTelemetry(null);

    setTemperaturePoints(
      [],
    );

    setFeedback({
      tone:
        "info",

      message:
        "Đã đưa cơ cấu về trạng thái ban đầu. Có thể thay đổi thông số và thực hiện lần đo tiếp theo.",
    });
  }

  function handleClearMeasurements() {
    if (
      measurements.length ===
      0
    ) {
      setFeedback({
        tone:
          "info",

        message:
          "Chưa có số liệu để xóa.",
      });

      return;
    }

    onClearMeasurements();

    setFeedback({
      tone:
        "success",

      message:
        "Đã xóa toàn bộ số liệu đo.",
    });
  }

  const canDecreaseMass =
    !setupLocked &&
    massPerSideKg >
      joulePhysicsConfig
        .massPerSideMinKg;

  const canIncreaseMass =
    !setupLocked &&
    massPerSideKg <
      joulePhysicsConfig
        .massPerSideMaxKg;

  return (
    <ExperimentWorkspace
      className="joule-practice"
      railExpanded={
        toolRailExpanded
      }
      simulation={
        <SimulationErrorBoundary>
          <JouleSimulation
            massPerSideKg={
              massPerSideKg
            }

            dropHeightM={
              dropHeightM
            }

            motionPhase={
              motionPhase
            }

            slowMotion={
              slowMotion
            }

            orbitEnabled={
              orbitEnabled
            }

            interactionLocked={
              measurementComplete
            }

            onMotionPhaseChange={
              handleMotionPhaseChange
            }

            onDropHeightChange={
              onDropHeightChange
            }

            onTelemetryChange={
              handleTelemetryChange
            }

            onMaxDropHeightChange={
              setMaxDropHeightM
            }
          />
        </SimulationErrorBoundary>
      }
    >

      {feedback && (
        <ExperimentToast
          className="joule-practice__feedback"
          tone={feedback.tone}
          message={feedback.message}
        />
      )}

      <div
        className="joule-practice-status"
        aria-label="Trạng thái thí nghiệm hiện tại"
      >
        <span>
          m mỗi bên
          <strong>
            {" "}
            {massPerSideKg.toFixed(1)}
            {" "}
            {jouleUnits.mass}
          </strong>
        </span>

        <span aria-hidden="true">
          ·
        </span>

        <span>
          h
          <strong>
            {" "}
            {dropHeightM.toFixed(1)}
            {" "}
            {jouleUnits.height}
          </strong>
        </span>

        <span aria-hidden="true">
          ·
        </span>

        <span>
          {measurementCount}
          /
          {targetMeasurementCount}
          {" lần đo"}
        </span>

        <span aria-hidden="true">
          ·
        </span>

        <strong
          className={`joule-practice-status__state joule-practice-status__state--${motionPhase}`}
        >
          {getMotionPhaseLabel(
            motionPhase,
          )}
        </strong>
      </div>

      {activePanel === "setup" && (
        <aside className="joule-practice-panel joule-practice-panel--setup">
          <div className="joule-practice-panel__header">
            <div>
              <span className="joule-practice-panel__eyebrow">
                Thiết lập
              </span>

              <h3>
                Thông số lần đo
              </h3>
            </div>

            <Button
              type="button"
              className="joule-practice-panel__close"
              onClick={() =>
                setActivePanel(null)
              }
              aria-label="Đóng bảng thiết lập"
            >
              ×
            </Button>
          </div>

          <div className="joule-setting">
            <div className="joule-setting__header">
              <span>
                Khối lượng mỗi bên
              </span>

              <strong>
                {
                  massPerSideKg.toFixed(
                    1,
                  )
                }{" "}
                {
                  jouleUnits.mass
                }
              </strong>
            </div>

            <div className="joule-setting__stepper">
              <Button
                type="button"
                className="joule-setting__step-button"
                onClick={() =>
                  changeMass(-1)
                }
                disabled={
                  !canDecreaseMass
                }
                aria-label="Giảm khối lượng tạ mỗi bên"
              >
                −
              </Button>

              <span>
                Tổng tạ:{" "}
                {
                  totalMassKg.toFixed(
                    1,
                  )
                }{" "}
                {
                  jouleUnits.mass
                }
              </span>

              <Button
                type="button"
                className="joule-setting__step-button"
                onClick={() =>
                  changeMass(1)
                }
                disabled={
                  !canIncreaseMass
                }
                aria-label="Tăng khối lượng tạ mỗi bên"
              >
                +
              </Button>
            </div>
          </div>

          <div className="joule-setting">
            <div className="joule-setting__header">
              <span>
                Độ cao thả
              </span>

              <strong>
                {
                  dropHeightM.toFixed(
                    1,
                  )
                }{" "}
                {
                  jouleUnits.height
                }
              </strong>
            </div>

            <p className="joule-setting__hint">
              {
                measurementComplete
                  ? (
                    <>
                      Đã đủ{" "}
                      {
                        targetMeasurementCount
                      }{" "}
                      lần đo. Xóa số liệu nếu muốn thực hiện lại.
                    </>
                  )
                  : (
                    <>
                      Kéo trực tiếp chồng tạ lên hoặc xuống để đặt độ cao. Giới hạn hiện tại:{" "}
                      {
                        maxDropHeightM.toFixed(
                          1,
                        )
                      }{" "}
                      {
                        jouleUnits.height
                      }.
                    </>
                  )
              }
            </p>
          </div>

          <div className="joule-runtime-state">
            <span>
              Trạng thái
            </span>

            <strong
              className={`joule-runtime-state__value joule-runtime-state__value--${motionPhase}`}
            >
              {
                getMotionPhaseLabel(
                  motionPhase,
                )
              }
            </strong>
          </div>

          <div className="joule-practice-panel__actions">
            {
              motionPhase ===
              "idle"
                ? (
                  <Button
                    type="button"
                    className="experiment-template__button experiment-template__button--primary"
                    onClick={
                      handleStart
                    }
                    disabled={
                      measurementComplete
                    }
                  >
                    Bắt đầu thả
                  </Button>
                )
                : (
                  <Button
                    type="button"
                    className="experiment-template__button"
                    onClick={
                      handleResetRuntime
                    }
                    disabled={
                      motionPhase !==
                      "finished"
                    }
                  >
                    Đặt lại cơ cấu
                  </Button>
                )
            }
          </div>
        </aside>
      )}

      {activePanel === "energy" && (
        <aside className="joule-practice-panel joule-practice-panel--energy">
          <div className="joule-practice-panel__header">
            <div>
              <span className="joule-practice-panel__eyebrow">
                Năng lượng tức thời
              </span>

              <h3>
                Theo dõi chuyển hóa
              </h3>
            </div>

            <Button
              type="button"
              className="joule-practice-panel__close"
              onClick={() =>
                setActivePanel(null)
              }
              aria-label="Đóng bảng năng lượng"
            >
              ×
            </Button>
          </div>

          <div className="joule-live-data">
            <div className="joule-live-data__item">
              <span>
                Thế năng
              </span>

              <strong>
                {
                  telemetry
                    ? telemetry
                        .potentialEnergyJ
                        .toFixed(1)
                    : "—"
                }{" "}
                {
                  jouleUnits.work
                }
              </strong>
            </div>

            <div className="joule-live-data__item">
              <span>
                Động năng
              </span>

              <strong>
                {
                  telemetry
                    ? telemetry
                        .kineticEnergyJ
                        .toFixed(1)
                    : "—"
                }{" "}
                {
                  jouleUnits.work
                }
              </strong>
            </div>

            <div className="joule-live-data__item">
              <span>
                Nhiệt lượng quy đổi
              </span>

              <strong>
                {
                  telemetry
                    ? telemetry
                        .heatEnergyJ
                        .toFixed(1)
                    : "—"
                }{" "}
                {
                  jouleUnits.work
                }
              </strong>
            </div>

            <div className="joule-live-data__item">
              <span>
                ΔT thật
              </span>

              <strong>
                {
                  telemetry
                    ? telemetry
                        .temperatureRiseC
                        .toFixed(4)
                    : "—"
                }{" "}
                {
                  jouleUnits
                    .temperatureRise
                }
              </strong>
            </div>

            <div className="joule-live-data__item">
              <span>
                Nhiệt độ nước
              </span>

              <strong>
                {
                  telemetry
                    ? telemetry
                        .temperatureC
                        .toFixed(4)
                    : "—"
                }{" "}
                {
                  jouleUnits
                    .temperature
                }
              </strong>
            </div>
          </div>
        </aside>
      )}

      {activePanel === "graph" && (
        <aside className="joule-practice-panel joule-practice-panel--graph">
          <div className="joule-practice-panel__header">
            <div>
              <span className="joule-practice-panel__eyebrow">
                Đồ thị T - t
              </span>

              <h3>
                Nhiệt độ theo thời gian
              </h3>
            </div>

            <Button
              type="button"
              className="joule-practice-panel__close"
              onClick={() =>
                setActivePanel(null)
              }
              aria-label="Đóng đồ thị"
            >
              ×
            </Button>
          </div>

          <JouleGraph
            points={
              temperaturePoints
            }
          />
        </aside>
      )}

      {activePanel === "measurements" && (
        <aside className="joule-practice-panel joule-practice-panel--measurements">
          <div className="joule-measurement__header">
            <div>
              <span className="joule-practice-panel__eyebrow">
                Số liệu thực nghiệm
              </span>

              <h3>
                Bảng 5 lần đo
              </h3>
            </div>

            <div className="joule-measurement__header-actions">
              <strong className="joule-measurement__count">
                {
                  measurementCount
                }
                /
                {
                  targetMeasurementCount
                }
              </strong>

              <Button
                type="button"
                className="joule-practice-panel__close"
                onClick={() =>
                  setActivePanel(null)
                }
                aria-label="Đóng bảng số liệu"
              >
                ×
              </Button>
            </div>
          </div>

          <div
            className="joule-measurement__progress"
            aria-label={`Đã hoàn thành ${measurementCount} trên ${targetMeasurementCount} lần đo`}
          >
            <span
              style={{
                width:
                  `${measurementProgress * 100}%`,
              }}
            />
          </div>

          <div className="joule-measurement__table-wrap">
            <table className="joule-measurement-table">
              <thead>
                <tr>
                  <th scope="col">
                    Lần
                  </th>

                  <th scope="col">
                    m
                  </th>

                  <th scope="col">
                    h
                  </th>

                  <th scope="col">
                    A
                  </th>

                  <th scope="col">
                    ΔT
                  </th>

                  <th scope="col">
                    Q
                  </th>

                  <th scope="col">
                    J
                  </th>

                  <th scope="col">
                    |ΔJ|
                  </th>
                </tr>
              </thead>

              <tbody>
                {
                  Array.from({
                    length:
                      targetMeasurementCount,
                  }).map(
                    (
                      _,
                      index,
                    ) => {
                      const result =
                        measurementResults[
                          index
                        ];

                      return (
                        <tr
                          key={
                            index
                          }
                        >
                          <th scope="row">
                            {
                              index +
                              1
                            }
                          </th>

                          <td>
                            {
                              result
                                ? result
                                    .measurement
                                    .totalMassKg
                                    .toFixed(1)
                                : "—"
                            }
                          </td>

                          <td>
                            {
                              result
                                ? result
                                    .measurement
                                    .dropHeightM
                                    .toFixed(1)
                                : "—"
                            }
                          </td>

                          <td>
                            {
                              result
                                ? result
                                    .measurement
                                    .mechanicalWorkJ
                                    .toFixed(1)
                                : "—"
                            }
                          </td>

                          <td>
                            {
                              result
                                ? result
                                    .measurement
                                    .temperatureRiseC
                                    .toFixed(4)
                                : "—"
                            }
                          </td>

                          <td>
                            {
                              result
                                ? result
                                    .heatCalories
                                    .toFixed(3)
                                : "—"
                            }
                          </td>

                          <td>
                            {
                              result
                                ? result
                                    .mechanicalEquivalent
                                    .toFixed(3)
                                : "—"
                            }
                          </td>

                          <td>
                            {
                              result
                                ? result
                                    .absoluteError
                                    .toFixed(3)
                                : "—"
                            }
                          </td>
                        </tr>
                      );
                    },
                  )
                }
              </tbody>
            </table>
          </div>

          <div className="joule-measurement__units">
            <span>
              m: {
                jouleUnits.mass
              }
            </span>

            <span>
              h: {
                jouleUnits.height
              }
            </span>

            <span>
              A: {
                jouleUnits.work
              }
            </span>

            <span>
              ΔT: {
                jouleUnits
                  .temperatureRise
              }
            </span>

            <span>
              Q: {
                jouleUnits.heat
              }
            </span>

            <span>
              J: {
                jouleUnits
                  .mechanicalEquivalent
              }
            </span>
          </div>

          <div className="joule-result-summary">
            <div className="joule-result-summary__item">
              <span>
                J trung bình
              </span>

              <strong>
                {
                  meanMechanicalEquivalent ===
                  null
                    ? "—"
                    : meanMechanicalEquivalent.toFixed(
                        3,
                      )
                }{" "}
                {
                  jouleUnits
                    .mechanicalEquivalent
                }
              </strong>
            </div>

            <div className="joule-result-summary__item">
              <span>
                Giá trị chuẩn
              </span>

              <strong>
                {
                  joulePhysicsConfig
                    .standardMechanicalEquivalentJPerCal
                    .toFixed(3)
                }{" "}
                {
                  jouleUnits
                    .mechanicalEquivalent
                }
              </strong>
            </div>

            <div className="joule-result-summary__item">
              <span>
                Sai số tuyệt đối
              </span>

              <strong>
                {
                  meanAbsoluteError ===
                  null
                    ? "—"
                    : meanAbsoluteError.toFixed(
                        3,
                      )
                }{" "}
                {
                  jouleUnits
                    .mechanicalEquivalent
                }
              </strong>
            </div>

            <div className="joule-result-summary__item">
              <span>
                Sai số tỉ đối
              </span>

              <strong>
                {
                  meanRelativeErrorPercent ===
                  null
                    ? "—"
                    : meanRelativeErrorPercent.toFixed(
                        2,
                      )
                }{" "}
                {
                  jouleUnits
                    .relativeError
                }
              </strong>
            </div>
          </div>

          <Button
            type="button"
            className="experiment-template__button joule-measurement__clear"
            onClick={
              handleClearMeasurements
            }
          >
            Xóa số liệu
          </Button>
        </aside>
      )}

      <div
        className={`joule-practice-rail ${
          toolRailExpanded
            ? "joule-practice-rail--expanded"
            : ""
        }`}
        aria-label="Công cụ thí nghiệm Joule"
      >
        <Button
          type="button"
          className="joule-practice-tool joule-practice-tool--rail-toggle"
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
          <span className="joule-practice-tool__icon">
            <RailIcon
              name={
                toolRailExpanded
                  ? "chevron-right"
                  : "chevron-left"
              }
            />
          </span>

          <span className="joule-practice-tool__label">
            Thu gọn
          </span>
        </Button>

        {onToggleWorkspaceExpanded && (
          <Button
            type="button"
            className={`joule-practice-tool ${
              workspaceExpanded
                ? "joule-practice-tool--active"
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
            <span className="joule-practice-tool__icon">
              <RailIcon
                name={
                  workspaceExpanded
                    ? "collapse"
                    : "expand"
                }
              />
            </span>

            <span className="joule-practice-tool__label">
              {workspaceExpanded
                ? "Thu nhỏ workspace"
                : "Mở rộng workspace"}
            </span>
          </Button>
        )}

        <div
          className="joule-practice-rail__separator"
          aria-hidden="true"
        />

        <Button
          type="button"
          className={`joule-practice-tool ${
            activePanel === "setup"
              ? "joule-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            togglePanel("setup")
          }
          aria-pressed={
            activePanel === "setup"
          }
          aria-label="Ẩn hoặc hiện thiết lập"
          data-tooltip="Thiết lập"
        >
          <span className="joule-practice-tool__icon">
            <RailIcon name="settings" />
          </span>

          <span className="joule-practice-tool__label">
            Thiết lập
          </span>
        </Button>

        <Button
          type="button"
          className={`joule-practice-tool ${
            activePanel === "energy"
              ? "joule-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            togglePanel("energy")
          }
          aria-pressed={
            activePanel === "energy"
          }
          aria-label="Ẩn hoặc hiện năng lượng tức thời"
          data-tooltip="Năng lượng"
        >
          <span className="joule-practice-tool__icon">
            <RailIcon name="energy" />
          </span>

          <span className="joule-practice-tool__label">
            Năng lượng
          </span>
        </Button>

        <Button
          type="button"
          className={`joule-practice-tool ${
            activePanel === "measurements"
              ? "joule-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            togglePanel(
              "measurements",
            )
          }
          aria-pressed={
            activePanel ===
            "measurements"
          }
          aria-label="Ẩn hoặc hiện bảng số liệu"
          data-tooltip="Số liệu"
        >
          <span className="joule-practice-tool__icon">
            <RailIcon name="clipboard" />
          </span>

          <span className="joule-practice-tool__label">
            Số liệu
          </span>
        </Button>

        <Button
          type="button"
          className={`joule-practice-tool ${
            activePanel === "graph"
              ? "joule-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            togglePanel("graph")
          }
          aria-pressed={
            activePanel === "graph"
          }
          aria-label="Ẩn hoặc hiện đồ thị nhiệt độ"
          data-tooltip="Đồ thị T - t"
        >
          <span className="joule-practice-tool__icon">
            <RailIcon name="chart" />
          </span>

          <span className="joule-practice-tool__label">
            Đồ thị
          </span>
        </Button>

        <div
          className="joule-practice-rail__separator"
          aria-hidden="true"
        />

        <Button
          type="button"
          className={`joule-practice-tool ${
            !orbitEnabled
              ? "joule-practice-tool--locked"
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
          <span className="joule-practice-tool__icon">
            <RailIcon
              name={
                orbitEnabled
                  ? "orbit"
                  : "lock"
              }
            />
          </span>

          <span className="joule-practice-tool__label">
            {orbitEnabled
              ? "Khóa góc nhìn"
              : "Bật xoay góc nhìn"}
          </span>
        </Button>

        <Button
          type="button"
          className={`joule-practice-tool ${
            slowMotion
              ? "joule-practice-tool--active"
              : ""
          }`}
          onClick={() =>
            setSlowMotion(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            slowMotion
          }
          aria-label="Bật hoặc tắt chuyển động chậm"
          data-tooltip="Chậm ×0,25"
        >
          <span className="joule-practice-tool__icon">
            <RailIcon name="slow" />
          </span>

          <span className="joule-practice-tool__label">
            Chậm ×0,25
          </span>
        </Button>
      </div>
    </ExperimentWorkspace>
  );
}
