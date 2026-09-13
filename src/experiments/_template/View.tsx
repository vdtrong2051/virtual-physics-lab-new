import ExperimentPhaseNav from "../../components/experiment/ExperimentPhaseNav";
import Button from "../../components/ui/Button";

import { useExperimentController } from "./controller";

import {
  experimentPhaseOrder,
  experimentPhases,
} from "./data";

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
    experimentPhaseOrder.indexOf(activePhase);

  function handlePhaseChange(phaseId: string) {
    const targetPhase = experimentPhases.find(
      (phase) => phase.id === phaseId
    );

    if (!targetPhase) {
      return;
    }

    goToPhase(targetPhase.id);
  }

  return (
    <div className="experiment-template">
      <ExperimentPhaseNav
        items={experimentPhases}
        activePhase={activePhase}
        onPhaseChange={handlePhaseChange}
      />

      <div className="experiment-template__content">
        <section className="experiment-template__phase">
          <div className="experiment-template__phase-header">
            <div>
              <span className="experiment-template__step">
                Bước {currentPhaseIndex + 1}
                {" / "}
                {experimentPhases.length}
              </span>

              <h2>{activePhaseDefinition.title}</h2>

              {activePhaseDefinition.description && (
                <p>
                  {activePhaseDefinition.description}
                </p>
              )}
            </div>

          </div>

          <div className="experiment-template__stage">
            {activePhase === "experiment" ? (
              <div className="experiment-template__placeholder">
                <span>Workspace thí nghiệm</span>

                <p>
                  Module thí nghiệm thật sẽ gắn mô hình vật lý
                  và vùng tương tác chính tại đây.
                </p>
              </div>
            ) : (
              <div className="experiment-template__placeholder">
                <span>
                  {activePhaseDefinition.title}
                </span>

                <p>
                  {activePhaseDefinition.description}
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="experiment-template__navigation">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={goToPreviousPhase}
            disabled={!canGoPrevious}
          >
            Bước trước
          </Button>

          <Button
            type="button"
            className="experiment-template__reset"
            onClick={resetExperiment}
          >
            Đặt lại toàn bộ thí nghiệm
          </Button>

          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            onClick={goToNextPhase}
            disabled={!canGoNext}
          >
            Bước tiếp
          </Button>
        </footer>
      </div>
    </div>
  );
}
