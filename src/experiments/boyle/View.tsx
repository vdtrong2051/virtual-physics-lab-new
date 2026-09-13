import {
  useEffect,
  useState,
} from "react";

import ExperimentPhaseNav from "../../components/experiment/ExperimentPhaseNav";
import Button from "../../components/ui/Button";

import BoyleConclusionPhase from "./components/BoyleConclusionPhase";
import BoyleIntroPhase from "./components/BoyleIntroPhase";
import BoylePracticePhase from "./components/BoylePracticePhase";
import BoylePreparationPhase from "./components/BoylePreparationPhase";
import BoyleQuizPhase from "./components/BoyleQuizPhase";
import BoyleReportPhase from "./components/BoyleReportPhase";

import {
  useBoyleController,
} from "./controller";

import {
  boylePhaseOrder,
  boylePhases,
} from "./data";

import type {
  BoylePhaseId,
} from "./model";

export default function BoyleView() {
  const controller =
    useBoyleController();

  const [
    workspaceExpanded,
    setWorkspaceExpanded,
  ] = useState(false);

  const currentPhaseIndex =
    boylePhaseOrder.indexOf(
      controller.activePhase,
    );

  useEffect(() => {
    if (!workspaceExpanded) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setWorkspaceExpanded(false);
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
  }, [workspaceExpanded]);

  function handlePhaseChange(
    phaseId: string,
  ) {
    const phase =
      boylePhases.find(
        (candidate) =>
          candidate.id === phaseId,
      );

    if (!phase) {
      return;
    }

    if (phase.id !== "prac") {
      setWorkspaceExpanded(false);
    }

    controller.goToPhase(
      phase.id,
    );
  }

  function handlePracticeContinue() {
    setWorkspaceExpanded(false);

    controller.goToNextPhase();
  }

  function handleResetExperiment() {
    setWorkspaceExpanded(false);

    controller.resetExperiment();
  }

  function renderActivePhase(
    phaseId: BoylePhaseId,
  ) {
    switch (phaseId) {
      case "intro":
        return (
          <BoyleIntroPhase
            onContinue={
              controller.goToNextPhase
            }
          />
        );

      case "prep":
        return (
          <BoylePreparationPhase
            selectedToolIds={
              controller.preparation
                .selectedToolIds
            }
            isPreparationComplete={
              controller.isPreparationComplete
            }
            onToggleTool={
              controller.togglePreparationTool
            }
            onBack={
              controller.goToPreviousPhase
            }
            onContinue={
              controller.goToNextPhase
            }
          />
        );

      case "prac":
        return (
          <BoylePracticePhase
            volume={
              controller.runtime.volume
            }
            thermalCondition={
              controller.runtime
                .thermalCondition
            }
            measurements={
              controller.measurements
            }
            workspaceExpanded={
              workspaceExpanded
            }
            onVolumeChange={
              controller.setVolume
            }
            onThermalConditionChange={
              controller.setThermalCondition
            }
            onFirePiston={
              controller
                .applyFirePistonCompression
            }
            onRecordMeasurement={
              controller.recordMeasurement
            }
            onClearMeasurements={
              controller.clearMeasurements
            }
            onToggleWorkspaceExpanded={() =>
              setWorkspaceExpanded(
                (current) => !current,
              )
            }
            onContinue={
              handlePracticeContinue
            }
          />
        );

      case "conc":
        return (
          <BoyleConclusionPhase
            measurements={
              controller.measurements
            }
            observations={
              controller.observations
            }
            onObservationChange={
              controller
                .setObservationResponse
            }
            onBack={
              controller.goToPreviousPhase
            }
            onContinue={
              controller.goToNextPhase
            }
          />
        );

      case "test":
        return (
          <BoyleQuizPhase
            assessment={
              controller.assessment
            }
            canSubmit={
              controller
                .canSubmitAssessment
            }
            score={
              controller.assessmentScore
            }
            onAnswer={
              controller
                .setAssessmentAnswer
            }
            onSubmit={
              controller.submitAssessment
            }
            onBack={
              controller.goToPreviousPhase
            }
            onContinue={
              controller.goToNextPhase
            }
          />
        );

      case "report":
        return (
          <BoyleReportPhase
            measurements={
              controller.measurements
            }
            observations={
              controller.observations
            }
            onBack={
              controller.goToPreviousPhase
            }
          />
        );
    }
  }

  const isPractice =
    controller.activePhase ===
    "prac";

  return (
    <div
      className={`experiment-template boyle-view ${
        workspaceExpanded
          ? "boyle-view--expanded"
          : ""
      }`}
    >
      <ExperimentPhaseNav
        items={[
          ...boylePhases,
        ]}
        activePhase={
          controller.activePhase
        }
        onPhaseChange={
          handlePhaseChange
        }
        ariaLabel="Điều hướng thí nghiệm Boyle-Mariotte"
      />

      <div className="boyle-view__body">
        <div className="boyle-view__utility">
          <div className="boyle-view__phase-info">
            <span>
              Bước{" "}
              {currentPhaseIndex + 1}
              {" / "}
              {boylePhases.length}
            </span>

            <strong>
              {
                controller
                  .activePhaseDefinition
                  .title
              }
            </strong>
          </div>

          <Button
            type="button"
            className="experiment-template__reset boyle-view__reset"
            onClick={
              handleResetExperiment
            }
          >
            Đặt lại toàn bộ thí nghiệm
          </Button>
        </div>

        <main
          className={`boyle-view__stage ${
            isPractice
              ? "boyle-view__stage--practice"
              : "boyle-view__stage--content"
          }`}
        >
          {renderActivePhase(
            controller.activePhase,
          )}
        </main>
      </div>
    </div>
  );
}