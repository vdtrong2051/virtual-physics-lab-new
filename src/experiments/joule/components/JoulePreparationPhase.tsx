import {
  useState,
} from "react";

import type {
  DragEvent,
} from "react";

import ExperimentToast from "../../../components/experiment/ExperimentToast";
import SimulationErrorBoundary from "../../../components/experiment/SimulationErrorBoundary";
import Button from "../../../components/ui/Button";

import {
  joulePreparationTools,
} from "../data";

import type {
  JoulePreparationToolId,
} from "../model";

import JoulePreparationScene from "../simulation/JoulePreparationScene";

type PreparationSelectionResult =
  | "selected"
  | "already-selected"
  | "distractor";

type JoulePreparationPhaseProps = {
  selectedToolIds:
    readonly JoulePreparationToolId[];
  isPreparationComplete: boolean;

  onSelectTool: (
    toolId: JoulePreparationToolId,
  ) => PreparationSelectionResult;

  onBack: () => void;
  onContinue: () => void;
};

type PreparationFeedback = {
  type: "success" | "error";
  message: string;
};

const JOULE_TOOL_MIME =
  "application/x-joule-tool";

function isPreparationToolId(
  value: string,
): value is JoulePreparationToolId {
  return joulePreparationTools.some(
    (tool) => tool.id === value,
  );
}

export default function JoulePreparationPhase({
  selectedToolIds,
  isPreparationComplete,
  onSelectTool,
  onBack,
  onContinue,
}: JoulePreparationPhaseProps) {
  const [
    feedback,
    setFeedback,
  ] = useState<
    PreparationFeedback | null
  >(null);

  const [
    draggingToolId,
    setDraggingToolId,
  ] = useState<
    JoulePreparationToolId | null
  >(null);

  const [
    isDragOver,
    setIsDragOver,
  ] = useState(false);

  const requiredToolCount =
    joulePreparationTools.filter(
      (tool) => tool.correct,
    ).length;

  const progress =
    requiredToolCount === 0
      ? 0
      : selectedToolIds.length /
        requiredToolCount;

  function attemptSelectTool(
    toolId: JoulePreparationToolId,
  ) {
    const tool =
      joulePreparationTools.find(
        (candidate) =>
          candidate.id === toolId,
      );

    if (!tool) {
      return;
    }

    const result =
      onSelectTool(toolId);

    if (result === "distractor") {
      setFeedback({
        type: "error",
        message: `Dụng cụ "${tool.name}" không phù hợp cho thí nghiệm Joule.`,
      });
      return;
    }

    if (result === "selected") {
      setFeedback({
        type: "success",
        message: `Đã lắp ráp: ${tool.name}.`,
      });
      return;
    }

    setFeedback(null);
  }

  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    toolId: JoulePreparationToolId,
  ) {
    event.dataTransfer.effectAllowed =
      "copy";

    event.dataTransfer.setData(
      JOULE_TOOL_MIME,
      toolId,
    );

    event.dataTransfer.setData(
      "text/plain",
      toolId,
    );

    setDraggingToolId(toolId);
  }

  function handleDragEnd() {
    setDraggingToolId(null);
    setIsDragOver(false);
  }

  function handleDragEnter(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect =
      "copy";

    if (!isDragOver) {
      setIsDragOver(true);
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>,
  ) {
    if (
      event.currentTarget.contains(
        event.relatedTarget as Node | null,
      )
    ) {
      return;
    }

    setIsDragOver(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setIsDragOver(false);
    setDraggingToolId(null);

    const rawToolId =
      event.dataTransfer.getData(
        JOULE_TOOL_MIME,
      ) ||
      event.dataTransfer.getData(
        "text/plain",
      );

    if (
      !rawToolId ||
      !isPreparationToolId(rawToolId)
    ) {
      return;
    }

    attemptSelectTool(rawToolId);
  }

  return (
    <div className="joule-preparation-workspace">
      <aside className="joule-preparation-inventory">
        <div className="joule-preparation-inventory__header">
          <span className="joule-preparation-inventory__eyebrow">
            Phần 2 · Chuẩn bị dụng cụ
          </span>

          <h2>
            Kho chứa
          </h2>

          <p>
            Kéo thả dụng cụ vào bàn 3D để
            lắp ráp. Trên thiết bị cảm ứng,
            chạm vào dụng cụ để lắp trực tiếp.
          </p>

          <div className="joule-preparation-progress">
            <div className="joule-preparation-progress__label">
              <span>
                Tiến độ lắp ráp
              </span>

              <strong>
                {selectedToolIds.length}
                {" / "}
                {requiredToolCount}
              </strong>
            </div>

            <div
              className="joule-preparation-progress__track"
              aria-label={`Đã lắp ${selectedToolIds.length} trên ${requiredToolCount} dụng cụ`}
            >
              <span
                style={{
                  width:
                    `${Math.min(progress, 1) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="joule-preparation-inventory__list">
          {joulePreparationTools.map(
            (tool) => {
              const isSelected =
                selectedToolIds.includes(
                  tool.id,
                );

              const isDragging =
                draggingToolId === tool.id;

              return (
                <Button
                  key={tool.id}
                  type="button"
                  className={`joule-preparation-tool ${
                    isSelected
                      ? "joule-preparation-tool--assembled"
                      : ""
                  } ${
                    isDragging
                      ? "joule-preparation-tool--dragging"
                      : ""
                  }`}
                  draggable={!isSelected}
                  onDragStart={(event) =>
                    handleDragStart(
                      event,
                      tool.id,
                    )
                  }
                  onDragEnd={
                    handleDragEnd
                  }
                  onClick={() =>
                    attemptSelectTool(
                      tool.id,
                    )
                  }
                  disabled={isSelected}
                  aria-pressed={isSelected}
                >
                  <span
                    className="joule-preparation-tool__icon"
                    aria-hidden="true"
                  >
                    {tool.icon}
                  </span>

                  <span className="joule-preparation-tool__content">
                    <strong>
                      {tool.name}
                    </strong>

                    <small>
                      {tool.description}
                    </small>
                  </span>

                  <span
                    className="joule-preparation-tool__state"
                    aria-hidden="true"
                  >
                    {isSelected
                      ? "✓"
                      : "⋮⋮"}
                  </span>
                </Button>
              );
            },
          )}
        </div>

        <div className="joule-preparation-inventory__footer">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={onBack}
          >
            ← Bước trước
          </Button>
        </div>
      </aside>

      <section
        className={`joule-preparation-stage ${
          isDragOver
            ? "joule-preparation-stage--drag-over"
            : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <SimulationErrorBoundary>
          <JoulePreparationScene
            assembledToolIds={selectedToolIds}
            dropActive={isDragOver}
          />
        </SimulationErrorBoundary>

        <div className="joule-preparation-stage__instruction">
          {selectedToolIds.length === 0
            ? "Kéo dụng cụ vào vùng lắp ráp"
            : `${selectedToolIds.length}/${requiredToolCount} bộ phận đã được lắp`}
        </div>

        {feedback && (
          <ExperimentToast
            className="joule-preparation-toast"
            tone={feedback.type}
            message={feedback.message}
          />
        )}

        {isDragOver && (
          <div className="joule-preparation-drop-overlay">
            <strong>
              Thả để lắp dụng cụ
            </strong>
          </div>
        )}

        {isPreparationComplete && (
          <Button
            type="button"
            className="joule-preparation-ready"
            onClick={onContinue}
          >
            Sẵn sàng thực hành
            <span aria-hidden="true">
              →
            </span>
          </Button>
        )}
      </section>
    </div>
  );
}
