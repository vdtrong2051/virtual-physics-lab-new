import ExperimentPhaseNav from "../../components/experiment/ExperimentPhaseNav";
import Button from "../../components/ui/Button";

import {
  useExperimentController,
} from "./controller";

import {
  experimentPhaseOrder,
  experimentPhases,
} from "./data";

import type {
  ExperimentPhaseId,
} from "./model";

export default function ExperimentView() {
  const {
    activePhase,
    activePhaseDefinition,
    goToPhase,
    goToNextPhase,
    goToPreviousPhase,
    canGoNext,
    canGoPrevious,
    resetExperiment,
  } = useExperimentController();

  const currentPhaseIndex =
    experimentPhaseOrder.indexOf(
      activePhase,
    );

  function handlePhaseChange(
    phaseId: string,
  ) {
    const targetPhase =
      experimentPhases.find(
        (phase) =>
          phase.id === phaseId,
      );

    if (!targetPhase) {
      return;
    }

    goToPhase(
      targetPhase.id,
    );
  }

  function renderPhasePlaceholder(
    phaseId: ExperimentPhaseId,
  ) {
    switch (phaseId) {
      case "intro":
        return (
          <div className="experiment-template__placeholder">
            <span>
              Giới thiệu thí nghiệm
            </span>

            <p>
              Thí nghiệm thật sẽ trình bày mục tiêu,
              hiện tượng vật lý và kiến thức nền tại đây.
            </p>
          </div>
        );

      case "prep":
        return (
          <div className="experiment-template__placeholder">
            <span>
              Chuẩn bị dụng cụ
            </span>

            <p>
              Thí nghiệm thật sẽ triển khai lựa chọn,
              kiểm tra hoặc lắp ráp dụng cụ tại đây.
            </p>
          </div>
        );

      case "prac":
        return (
          <div className="experiment-template__placeholder">
            <span>
              Workspace thí nghiệm
            </span>

            <p>
              Module thí nghiệm thật sẽ gắn mô hình vật lý,
              vùng tương tác và quá trình thu thập dữ liệu
              tại đây.
            </p>
          </div>
        );

      case "conc":
        return (
          <div className="experiment-template__placeholder">
            <span>
              Kết luận
            </span>

            <p>
              Thí nghiệm thật sẽ phân tích kết quả,
              ghi nhận quan sát và rút ra kết luận tại đây.
            </p>
          </div>
        );

      case "test":
        return (
          <div className="experiment-template__placeholder">
            <span>
              Luyện tập
            </span>

            <p>
              Câu hỏi kiểm tra hoặc hoạt động củng cố
              của từng thí nghiệm sẽ được gắn tại đây.
            </p>
          </div>
        );

      case "report":
        return (
          <div className="experiment-template__placeholder">
            <span>
              Báo cáo
            </span>

            <p>
              Dữ liệu tham chiếu và biểu mẫu báo cáo
              riêng của từng thí nghiệm sẽ được gắn tại đây.
            </p>
          </div>
        );
    }
  }

  return (
    <div className="experiment-template">
      <ExperimentPhaseNav
        items={experimentPhases}
        activePhase={
          activePhase
        }
        onPhaseChange={
          handlePhaseChange
        }
      />

      <div className="experiment-template__content">
        <section className="experiment-template__phase">
          <div className="experiment-template__phase-header">
            <div>
              <span className="experiment-template__step">
                Bước{" "}
                {currentPhaseIndex + 1}
                {" / "}
                {
                  experimentPhases.length
                }
              </span>

              <h2>
                {
                  activePhaseDefinition
                    .title
                }
              </h2>

              {activePhaseDefinition
                .description && (
                <p>
                  {
                    activePhaseDefinition
                      .description
                  }
                </p>
              )}
            </div>
          </div>

          <div className="experiment-template__stage">
            {renderPhasePlaceholder(
              activePhase,
            )}
          </div>
        </section>

        <footer className="experiment-template__navigation">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={
              goToPreviousPhase
            }
            disabled={
              !canGoPrevious
            }
          >
            Bước trước
          </Button>

          <Button
            type="button"
            className="experiment-template__reset"
            onClick={
              resetExperiment
            }
          >
            Đặt lại toàn bộ thí nghiệm
          </Button>

          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            onClick={
              goToNextPhase
            }
            disabled={
              !canGoNext
            }
          >
            Bước tiếp
          </Button>
        </footer>
      </div>
    </div>
  );
}