import {
  useEffect,
  useState,
} from "react";

import ExperimentViewShell from "../../components/experiment/ExperimentViewShell";
import Button from "../../components/ui/Button";

import JouleConclusionPhase from "./components/JouleConclusionPhase";
import JouleIntroPhase from "./components/JouleIntroPhase";
import JoulePracticePhase from "./components/JoulePracticePhase";
import JoulePreparationPhase from "./components/JoulePreparationPhase";
import JouleQuizPhase from "./components/JouleQuizPhase";
import JouleReportPhase from "./components/JouleReportPhase";

import {
  useJouleController,
} from "./controller";

import {
  joulePhases,
} from "./data";

import type {
  JoulePhaseId,
} from "./model";

export default function JouleView() {
  const controller =
    useJouleController();

  const [
    workspaceExpanded,
    setWorkspaceExpanded,
  ] = useState(false);

  const isPractice =
    controller.activePhase ===
    "prac";

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
      joulePhases.find(
        (candidate) =>
          candidate.id === phaseId,
      );

    if (!phase) {
      return;
    }

    if (
      controller.activePhase ===
        "prac" &&
      phase.id !== "prac"
    ) {
      setWorkspaceExpanded(false);

      controller.resetRuntime();
    }

    controller.goToPhase(
      phase.id,
    );
  }

  function handleResetExperiment() {
    setWorkspaceExpanded(false);

    controller.resetExperiment();
  }

  function handleToggleWorkspaceExpanded() {
    if (!isPractice) {
      return;
    }

    setWorkspaceExpanded(
      (current) => !current,
    );
  }

  function renderActivePhase(
    phaseId: JoulePhaseId,
  ) {
    switch (phaseId) {
      case "intro":
        return (
          <JouleIntroPhase
            onContinue={
              controller.goToNextPhase
            }
          />
        );

      case "prep":
        return (
          <JoulePreparationPhase
            selectedToolIds={
              controller.preparation
                .selectedToolIds
            }
            isPreparationComplete={
              controller
                .isPreparationComplete
            }
            onSelectTool={
              controller
                .selectPreparationTool
            }
            onBack={
              controller
                .goToPreviousPhase
            }
            onContinue={
              controller
                .goToNextPhase
            }
          />
        );

      case "prac":
        return (
          <JoulePracticePhase
            massPerSideKg={
              controller.runtime
                .massPerSideKg
            }
            dropHeightM={
              controller.runtime
                .dropHeightM
            }
            motionPhase={
              controller.runtime
                .motionPhase
            }
            measurements={
              controller.measurements
            }
            onMassPerSideChange={
              controller
                .setMassPerSideKg
            }
            onDropHeightChange={
              controller
                .setDropHeightM
            }
            onMotionPhaseChange={
              controller
                .setMotionPhase
            }
            onRecordMeasurement={
              controller
                .recordMeasurement
            }
            onClearMeasurements={
              controller
                .clearMeasurements
            }
            onResetRuntime={
              controller
                .resetRuntime
            }
            workspaceExpanded={
              workspaceExpanded
            }
            onToggleWorkspaceExpanded={
              handleToggleWorkspaceExpanded
            }
          />
        );

      case "conc":
        return (
          <JouleConclusionPhase
            measurements={
              controller.measurements
            }
            onBack={
              controller
                .goToPreviousPhase
            }
            onContinue={
              controller
                .goToNextPhase
            }
          />
        );

      case "test":
        return (
          <JouleQuizPhase
            assessment={
              controller.assessment
            }
            canSubmit={
              controller
                .canSubmitAssessment
            }
            score={
              controller
                .assessmentScore
            }
            onAnswer={
              controller
                .setAssessmentAnswer
            }
            onSubmit={
              controller
                .submitAssessment
            }
            onBack={
              controller
                .goToPreviousPhase
            }
            onContinue={
              controller
                .goToNextPhase
            }
          />
        );

      case "report":
        return (
          <JouleReportPhase
            measurements={
              controller.measurements
            }
            onBack={
              controller
                .goToPreviousPhase
            }
          />
        );
    }
  }

  return (
    <ExperimentViewShell
      viewClassName="joule-view"
      phases={joulePhases}
      activePhase={
        controller.activePhase
      }
      onPhaseChange={
        handlePhaseChange
      }
      ariaLabel="Điều hướng thí nghiệm Joule"
      workspaceExpanded={
        workspaceExpanded
      }
      isPractice={
        isPractice
      }
      utilityActions={
        <div className="joule-view__utility-actions">
          <Button
            type="button"
            className="experiment-template__reset joule-view__reset"
            onClick={
              handleResetExperiment
            }
          >
            Đặt lại toàn bộ thí nghiệm
          </Button>
        </div>
      }
    >
      {renderActivePhase(
        controller.activePhase,
      )}
    </ExperimentViewShell>
  );
}