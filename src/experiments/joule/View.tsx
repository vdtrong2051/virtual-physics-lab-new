import {
  useEffect,
  useState,
} from "react";

import ExperimentPhaseNav from "../../components/experiment/ExperimentPhaseNav";
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
  joulePhaseOrder,
  joulePhases,
} from "./data";

import type {
  JoulePhaseId,
} from "./model";

export default function JouleView() {
  const controller =
    useJouleController();

  /*
   * Workspace expanded thuộc View,
   * giống ownership đã chứng minh ở Boyle.
   *
   * Đây không phải browser Fullscreen API.
   * CSS sẽ biến .joule-view--expanded
   * thành lab workspace overlay.
   */
  const [
    workspaceExpanded,
    setWorkspaceExpanded,
  ] = useState(false);

  const currentPhaseIndex =
    joulePhaseOrder.indexOf(
      controller.activePhase,
    );

  const isPractice =
    controller.activePhase ===
    "prac";

  /*
   * Escape luôn thoát expanded workspace.
   */
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

    /*
     * Rời Practice:
     *
     * - thoát expanded
     * - reset runtime về idle
     * - KHÔNG xóa measurements
     *
     * Tránh Scene unmount khi controller
     * vẫn giữ falling / spinning.
     */
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
    <div
      className={`experiment-template joule-view ${
        workspaceExpanded
          ? "joule-view--expanded"
          : ""
      }`}
    >
      <ExperimentPhaseNav
        items={[
          ...joulePhases,
        ]}
        activePhase={
          controller.activePhase
        }
        onPhaseChange={
          handlePhaseChange
        }
        ariaLabel="Điều hướng thí nghiệm Joule"
      />

      <div className="joule-view__body">
        <div className="joule-view__utility">
          <div className="joule-view__phase-info">
            <span>
              Bước{" "}
              {currentPhaseIndex + 1}
              {" / "}
              {joulePhases.length}
            </span>

            <strong>
              {
                controller
                  .activePhaseDefinition
                  .title
              }
            </strong>
          </div>

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
        </div>

        <main
          className={`joule-view__stage ${
            isPractice
              ? "joule-view__stage--practice"
              : "joule-view__stage--content"
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