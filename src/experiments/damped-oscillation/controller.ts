import {
  useMemo,
  useState,
} from "react";

import {
  dampedAssessmentQuestions,
  dampedInitialPhaseId,
  dampedPhaseOrder,
  dampedPhases,
  dampedPhysicsConfig,
} from "./data";

import type {
  DampedAnswerIndex,
  DampedAssessmentState,
  DampedPhaseId,
  DampedQuestionId,
  DampedRuntimeState,
  DampedSnapshot,
} from "./model";

function createInitialRuntime(): DampedRuntimeState {
  return {
    damping:
      dampedPhysicsConfig.dampingDefault,
    paperSpeed:
      dampedPhysicsConfig.paperSpeedDefault,
    isPlaying: false,
    hasStarted: false,
    resetVersion: 0,
    isCameraLocked: false,
  };
}

function createInitialAssessment(): DampedAssessmentState {
  return {
    answers: {},
    submitted: false,
  };
}

function getPhaseDefinition(
  phaseId: DampedPhaseId,
) {
  const phase = dampedPhases.find(
    (candidate) => candidate.id === phaseId,
  );

  if (!phase) {
    throw new Error(
      `Unknown damped oscillation phase: ${phaseId}`,
    );
  }

  return phase;
}

function getAdjacentPhase(
  phaseId: DampedPhaseId,
  direction: -1 | 1,
): DampedPhaseId | null {
  const currentIndex =
    dampedPhaseOrder.indexOf(phaseId);

  if (currentIndex < 0) {
    return null;
  }

  return (
    dampedPhaseOrder[
      currentIndex + direction
    ] ?? null
  );
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

export function useDampedController() {
  const [activePhase, setActivePhase] =
    useState<DampedPhaseId>(
      dampedInitialPhaseId,
    );

  const [runtime, setRuntime] =
    useState<DampedRuntimeState>(
      createInitialRuntime,
    );

  const [snapshots, setSnapshots] =
    useState<DampedSnapshot[]>([]);

  const [showComparison, setShowComparison] =
    useState(false);

  const [assessment, setAssessment] =
    useState<DampedAssessmentState>(
      createInitialAssessment,
    );

  const activePhaseDefinition =
    useMemo(
      () => getPhaseDefinition(activePhase),
      [activePhase],
    );

  const previousPhaseId =
    getAdjacentPhase(activePhase, -1);

  const nextPhaseId =
    getAdjacentPhase(activePhase, 1);

  const goToPhase = (
    phaseId: DampedPhaseId,
  ) => {
    getPhaseDefinition(phaseId);
    setActivePhase(phaseId);
  };

  const goToPreviousPhase = () => {
    if (previousPhaseId) {
      setActivePhase(previousPhaseId);
    }
  };

  const goToNextPhase = () => {
    if (nextPhaseId) {
      setActivePhase(nextPhaseId);
    }
  };

  const setDamping = (damping: number) => {
    setRuntime((current) => {
      if (current.hasStarted) {
        return current;
      }

      return {
        ...current,
        damping: clamp(
          damping,
          dampedPhysicsConfig.dampingMin,
          dampedPhysicsConfig.dampingMax,
        ),
      };
    });
  };

  const setPaperSpeed = (
    paperSpeed: number,
  ) => {
    setRuntime((current) => {
      if (current.hasStarted) {
        return current;
      }

      return {
        ...current,
        paperSpeed: clamp(
          paperSpeed,
          dampedPhysicsConfig.paperSpeedMin,
          dampedPhysicsConfig.paperSpeedMax,
        ),
      };
    });
  };

  const togglePlayback = () => {
    setRuntime((current) => ({
      ...current,
      isPlaying: !current.isPlaying,
      hasStarted: true,
    }));
  };

  const pauseRuntime = () => {
    setRuntime((current) => ({
      ...current,
      isPlaying: false,
    }));
  };

  const resetRuntime = () => {
    setRuntime((current) => ({
      ...current,
      isPlaying: false,
      hasStarted: false,
      resetVersion:
        current.resetVersion + 1,
    }));
  };

  const toggleCameraLock = () => {
    setRuntime((current) => ({
      ...current,
      isCameraLocked:
        !current.isCameraLocked,
    }));
  };

  const addSnapshot = (url: string) => {
    setSnapshots((current) => {
      const next = [
        ...current,
        {
          id: Date.now(),
          url,
          damping: runtime.damping,
        },
      ];

      return next.slice(
        -dampedPhysicsConfig.snapshotLimit,
      );
    });
  };

  const clearSnapshots = () => {
    setSnapshots([]);
    setShowComparison(false);
  };

  const openComparison = () => {
    if (snapshots.length > 0) {
      setShowComparison(true);
    }
  };

  const closeComparison = () => {
    setShowComparison(false);
  };

  const setAssessmentAnswer = (
    questionId: DampedQuestionId,
    answer: DampedAnswerIndex,
  ) => {
    setAssessment((current) => {
      if (current.submitted) {
        return current;
      }

      return {
        ...current,
        answers: {
          ...current.answers,
          [questionId]: answer,
        },
      };
    });
  };

  const submitAssessment = () => {
    if (assessment.submitted) {
      return false;
    }

    setAssessment((current) => ({
      ...current,
      submitted: true,
    }));

    return true;
  };

  const assessmentScore =
    useMemo(
      () =>
        dampedAssessmentQuestions.reduce(
          (score, question) =>
            assessment.answers[
              question.id
            ] === question.correctOption
              ? score + 1
              : score,
          0,
        ),
      [assessment.answers],
    );

  const resetExperiment = () => {
    setActivePhase(dampedInitialPhaseId);
    setRuntime(createInitialRuntime());
    setSnapshots([]);
    setShowComparison(false);
    setAssessment(createInitialAssessment());
  };

  return {
    activePhase,
    activePhaseDefinition,
    canGoPrevious:
      previousPhaseId !== null,
    canGoNext: nextPhaseId !== null,
    goToPhase,
    goToPreviousPhase,
    goToNextPhase,

    runtime,
    setDamping,
    setPaperSpeed,
    togglePlayback,
    pauseRuntime,
    resetRuntime,
    toggleCameraLock,

    snapshots,
    showComparison,
    addSnapshot,
    clearSnapshots,
    openComparison,
    closeComparison,

    assessment,
    assessmentScore,
    setAssessmentAnswer,
    submitAssessment,

    resetExperiment,
  };
}
