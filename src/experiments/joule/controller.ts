import { useMemo, useState } from "react";

import {
  jouleAssessmentQuestions,
  jouleInitialPhaseId,
  joulePhaseOrder,
  joulePhases,
  joulePhysicsConfig,
  joulePreparationTools,
} from "./data";

import { createJouleMeasurement } from "./math/jouleMath";

import type {
  JouleAnswerIndex,
  JouleAssessmentState,
  JouleMeasurement,
  JouleMotionPhase,
  JoulePhaseId,
  JoulePreparationState,
  JoulePreparationToolId,
  JouleQuestionId,
  JouleRuntimeState,
} from "./model";

export type JoulePreparationSelectionResult =
  | "selected"
  | "already-selected"
  | "distractor";

export type JouleRecordMeasurementResult =
  | "recorded"
  | "not-finished"
  | "limit-reached";

function createInitialRuntime(): JouleRuntimeState {
  return {
    massPerSideKg:
      joulePhysicsConfig.massPerSideDefaultKg,
    dropHeightM:
      joulePhysicsConfig.dropHeightDefaultM,
    motionPhase: "idle",
  };
}

function createInitialPreparation(): JoulePreparationState {
  return {
    selectedToolIds: [],
  };
}

function createInitialAssessment(): JouleAssessmentState {
  return {
    answers: {},
    submitted: false,
  };
}

function getPhaseDefinition(
  phaseId: JoulePhaseId,
) {
  const phase = joulePhases.find(
    (candidate) => candidate.id === phaseId,
  );

  if (!phase) {
    throw new Error(
      `Unknown Joule phase: ${phaseId}`,
    );
  }

  return phase;
}

function getAdjacentPhase(
  phaseId: JoulePhaseId,
  direction: -1 | 1,
): JoulePhaseId | null {
  const currentIndex =
    joulePhaseOrder.indexOf(phaseId);

  if (currentIndex < 0) {
    return null;
  }

  const targetId =
    joulePhaseOrder[currentIndex + direction];

  if (!targetId) {
    return null;
  }

  const targetPhase =
    getPhaseDefinition(targetId);

  if (targetPhase.disabled) {
    return null;
  }

  return targetId;
}

export function useJouleController() {
  const [activePhase, setActivePhase] =
    useState<JoulePhaseId>(
      jouleInitialPhaseId,
    );

  const [preparation, setPreparation] =
    useState<JoulePreparationState>(
      createInitialPreparation,
    );

  const [runtime, setRuntime] =
    useState<JouleRuntimeState>(
      createInitialRuntime,
    );

  const [measurements, setMeasurements] =
    useState<JouleMeasurement[]>([]);

  const [assessment, setAssessment] =
    useState<JouleAssessmentState>(
      createInitialAssessment,
    );

  const activePhaseDefinition =
    useMemo(
      () => getPhaseDefinition(activePhase),
      [activePhase],
    );

  const previousPhaseId =
    getAdjacentPhase(
      activePhase,
      -1,
    );

  const nextPhaseId =
    getAdjacentPhase(
      activePhase,
      1,
    );

  const canGoPrevious =
    previousPhaseId !== null;

  const canGoNext =
    nextPhaseId !== null;

  const goToPhase = (
    phaseId: JoulePhaseId,
  ) => {
    const phase =
      getPhaseDefinition(phaseId);

    if (phase.disabled) {
      return;
    }

    setActivePhase(phaseId);
  };

  const goToPreviousPhase = () => {
    if (!previousPhaseId) {
      return;
    }

    setActivePhase(previousPhaseId);
  };

  const goToNextPhase = () => {
    if (!nextPhaseId) {
      return;
    }

    setActivePhase(nextPhaseId);
  };

  const selectPreparationTool = (
    toolId: JoulePreparationToolId,
  ): JoulePreparationSelectionResult => {
    const tool =
      joulePreparationTools.find(
        (candidate) =>
          candidate.id === toolId,
      );

    if (!tool || !tool.correct) {
      return "distractor";
    }

    if (
      preparation.selectedToolIds.includes(
        toolId,
      )
    ) {
      return "already-selected";
    }

    setPreparation((current) => ({
      selectedToolIds: [
        ...current.selectedToolIds,
        toolId,
      ],
    }));

    return "selected";
  };

  const isPreparationComplete =
    useMemo(() => {
      const requiredToolIds =
        joulePreparationTools
          .filter((tool) => tool.correct)
          .map((tool) => tool.id);

      return requiredToolIds.every(
        (toolId) =>
          preparation.selectedToolIds.includes(
            toolId,
          ),
      );
    }, [preparation.selectedToolIds]);

  const setMassPerSideKg = (
    massPerSideKg: number,
  ) => {
    if (
      runtime.motionPhase !== "idle"
    ) {
      return false;
    }

    const clampedMass = Math.min(
      joulePhysicsConfig.massPerSideMaxKg,
      Math.max(
        joulePhysicsConfig.massPerSideMinKg,
        massPerSideKg,
      ),
    );

    setRuntime((current) => ({
      ...current,
      massPerSideKg: clampedMass,
    }));

    return true;
  };

  const setDropHeightM = (
    dropHeightM: number,
  ) => {
    if (
      runtime.motionPhase !== "idle"
    ) {
      return false;
    }

    const clampedHeight = Math.max(
      joulePhysicsConfig.dropHeightMinM,
      dropHeightM,
    );

    setRuntime((current) => ({
      ...current,
      dropHeightM: clampedHeight,
    }));

    return true;
  };

  const setMotionPhase = (
    motionPhase: JouleMotionPhase,
  ) => {
    setRuntime((current) => ({
      ...current,
      motionPhase,
    }));
  };

  const measurementLimitReached =
    measurements.length >=
    joulePhysicsConfig
      .targetMeasurementCount;

  const canRecordMeasurement =
    runtime.motionPhase === "finished" &&
    !measurementLimitReached;

  const recordMeasurement = (
    temperatureRiseC: number,
  ): JouleRecordMeasurementResult => {
    if (
      runtime.motionPhase !== "finished"
    ) {
      return "not-finished";
    }

    if (measurementLimitReached) {
      return "limit-reached";
    }

    const measurement =
      createJouleMeasurement(
        runtime.massPerSideKg,
        runtime.dropHeightM,
        temperatureRiseC,
        joulePhysicsConfig.gravityMPerS2,
      );

    setMeasurements((current) => [
      ...current,
      measurement,
    ]);

    return "recorded";
  };

  const clearMeasurements = () => {
    setMeasurements([]);
  };

  const setAssessmentAnswer = (
    questionId: JouleQuestionId,
    answer: JouleAnswerIndex,
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

  const canSubmitAssessment =
    jouleAssessmentQuestions.every(
      (question) =>
        assessment.answers[
          question.id
        ] !== undefined,
    );

  const submitAssessment = () => {
    if (
      assessment.submitted ||
      !canSubmitAssessment
    ) {
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
        jouleAssessmentQuestions.reduce(
          (score, question) =>
            assessment.answers[
              question.id
            ] ===
            question.correctOption
              ? score + 1
              : score,
          0,
        ),
      [assessment.answers],
    );

  const resetRuntime = () => {
    setRuntime((current) => ({
      ...current,
      motionPhase: "idle",
    }));
  };

  const resetExperiment = () => {
    setActivePhase(
      jouleInitialPhaseId,
    );

    setPreparation(
      createInitialPreparation(),
    );

    setRuntime(
      createInitialRuntime(),
    );

    setMeasurements([]);

    setAssessment(
      createInitialAssessment(),
    );
  };

  return {
    activePhase,
    activePhaseDefinition,
    canGoPrevious,
    canGoNext,

    goToPhase,
    goToPreviousPhase,
    goToNextPhase,

    preparation,
    isPreparationComplete,
    selectPreparationTool,

    runtime,
    setMassPerSideKg,
    setDropHeightM,
    setMotionPhase,

    measurements,
    measurementLimitReached,
    canRecordMeasurement,
    recordMeasurement,
    clearMeasurements,

    assessment,
    canSubmitAssessment,
    assessmentScore,
    setAssessmentAnswer,
    submitAssessment,

    resetRuntime,
    resetExperiment,
  };
}
