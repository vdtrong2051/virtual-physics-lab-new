import ExperimentViewShell from "../../components/experiment/ExperimentViewShell";
import Button from "../../components/ui/Button";

import "katex/dist/katex.min.css";
import "./damped.css";

import DampedConclusionPhase from "./components/DampedConclusionPhase";
import DampedIntroPhase from "./components/DampedIntroPhase";
import DampedPracticePhase from "./components/DampedPracticePhase";
import DampedPreparationPhase from "./components/DampedPreparationPhase";
import DampedQuizPhase from "./components/DampedQuizPhase";
import DampedReportPhase from "./components/DampedReportPhase";

import {
  useDampedController,
} from "./controller";

import {
  dampedPhases,
} from "./data";

import type {
  DampedPhaseId,
} from "./model";

export default function DampedView() {
  const controller =
    useDampedController();

  function handlePhaseChange(
    phaseId: string,
  ) {
    const phase = dampedPhases.find(
      (candidate) =>
        candidate.id === phaseId,
    );

    if (!phase) {
      return;
    }

    if (phase.id !== "prac") {
      controller.pauseRuntime();
      controller.closeComparison();
    }

    controller.goToPhase(phase.id);
  }

  function handlePracticeBack() {
    controller.pauseRuntime();
    controller.closeComparison();
    controller.goToPreviousPhase();
  }

  function handlePracticeContinue() {
    controller.pauseRuntime();
    controller.closeComparison();
    controller.goToNextPhase();
  }

  function renderActivePhase(
    phaseId: DampedPhaseId,
  ) {
    switch (phaseId) {
      case "intro":
        return (
          <DampedIntroPhase
            onContinue={
              controller.goToNextPhase
            }
          />
        );

      case "prep":
        return (
          <DampedPreparationPhase
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
          <DampedPracticePhase
            runtime={controller.runtime}
            snapshots={controller.snapshots}
            showComparison={
              controller.showComparison
            }
            onDampingChange={
              controller.setDamping
            }
            onPaperSpeedChange={
              controller.setPaperSpeed
            }
            onTogglePlayback={
              controller.togglePlayback
            }
            onResetRuntime={
              controller.resetRuntime
            }
            onToggleCameraLock={
              controller.toggleCameraLock
            }
            onAddSnapshot={
              controller.addSnapshot
            }
            onClearSnapshots={
              controller.clearSnapshots
            }
            onOpenComparison={
              controller.openComparison
            }
            onCloseComparison={
              controller.closeComparison
            }
            onBack={handlePracticeBack}
            onContinue={
              handlePracticeContinue
            }
          />
        );

      case "conc":
        return (
          <DampedConclusionPhase
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
          <DampedQuizPhase
            assessment={
              controller.assessment
            }
            score={
              controller.assessmentScore
            }
            onAnswer={
              controller.setAssessmentAnswer
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
          <DampedReportPhase
            onBack={
              controller.goToPreviousPhase
            }
          />
        );
    }
  }

  return (
    <ExperimentViewShell
      viewClassName="damped-view"
      phases={dampedPhases}
      activePhase={controller.activePhase}
      onPhaseChange={handlePhaseChange}
      ariaLabel="Điều hướng thí nghiệm dao động tắt dần"
      workspaceExpanded={false}
      isPractice={
        controller.activePhase === "prac"
      }
      utilityActions={
        <Button
          type="button"
          className="experiment-template__reset damped-view__reset"
          onClick={
            controller.resetExperiment
          }
        >
          Đặt lại toàn bộ thí nghiệm
        </Button>
      }
    >
      {renderActivePhase(
        controller.activePhase,
      )}
    </ExperimentViewShell>
  );
}
