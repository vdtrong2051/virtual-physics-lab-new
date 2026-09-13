import { useState } from "react";

import Button from "../../../components/ui/Button";

import { boylePreparationTools } from "../data";

import type {
  BoylePreparationToolId,
} from "../model";

type BoylePreparationPhaseProps = {
  selectedToolIds: readonly BoylePreparationToolId[];
  isPreparationComplete: boolean;

  onToggleTool: (
    toolId: BoylePreparationToolId,
  ) => void;

  onBack: () => void;
  onContinue: () => void;
};

const PREPARATION_ERROR_MESSAGE =
  "Lựa chọn chưa chính xác. Vui lòng chỉ chọn các thiết bị thuộc bộ thí nghiệm định luật Boyle-Mariotte và loại bỏ các dụng cụ không liên quan.";

export default function BoylePreparationPhase({
  selectedToolIds,
  isPreparationComplete,
  onToggleTool,
  onBack,
  onContinue,
}: BoylePreparationPhaseProps) {
  const [errorMessage, setErrorMessage] =
    useState("");

  function handleToggleTool(
    toolId: BoylePreparationToolId,
  ) {
    if (errorMessage) {
      setErrorMessage("");
    }

    onToggleTool(toolId);
  }

  function handleVerify() {
    if (!isPreparationComplete) {
      setErrorMessage(
        PREPARATION_ERROR_MESSAGE,
      );

      return;
    }

    setErrorMessage("");
    onContinue();
  }

  return (
    <div className="boyle-content-phase">
      <div className="boyle-content-phase__inner">
        <span className="boyle-content-phase__badge">
          Phần 2 · Chuẩn bị dụng cụ
        </span>

        <div className="boyle-preparation__heading">
          <h3>Lựa chọn thiết bị thí nghiệm</h3>

          <p>
            Chọn đúng các dụng cụ cần thiết để khảo sát
            định luật Boyle-Mariotte.
          </p>
        </div>

        {errorMessage && (
          <div
            className="boyle-preparation__feedback"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <div className="boyle-tool-grid">
          {boylePreparationTools.map((tool) => {
            const isSelected =
              selectedToolIds.includes(tool.id);

            return (
              <Button
                key={tool.id}
                type="button"
                className={`boyle-tool-card ${
                  isSelected
                    ? "boyle-tool-card--selected"
                    : ""
                }`}
                onClick={() =>
                  handleToggleTool(tool.id)
                }
                aria-pressed={isSelected}
              >
                <span
                  className="boyle-tool-card__icon"
                  aria-hidden="true"
                >
                  {tool.icon}
                </span>

                <span className="boyle-tool-card__name">
                  {tool.name}
                </span>

                <span
                  className="boyle-tool-card__check"
                  aria-hidden="true"
                >
                  ✓
                </span>
              </Button>
            );
          })}
        </div>

        <div className="boyle-phase-actions">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={onBack}
          >
            Bước trước
          </Button>

          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            onClick={handleVerify}
          >
            Xác nhận thiết bị
          </Button>
        </div>
      </div>
    </div>
  );
}