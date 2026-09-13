import { useMemo, useState } from "react";

import {
  boyleAssessmentQuestions,
  boyleInitialPhaseId,
  boylePhaseOrder,
  boylePhases,
  boylePhysicsConfig,
  boylePreparationTools,
} from "./data";

import { createBoyleMeasurement } from "./math/boyleMath";

import type {
  BoyleAnswerIndex,
  BoyleAssessmentState,
  BoyleMeasurement,
  BoyleObservation,
  BoyleObservationId,
  BoylePhaseId,
  BoylePreparationState,
  BoylePreparationToolId,
  BoyleQuestionId,
  BoyleRuntimeState,
  BoyleThermalCondition,
} from "./model";

export type BoyleRecordMeasurementResult =
  | "recorded"
  | "thermal-transient"
  | "duplicate-volume"
  | "limit-reached";

function createInitialRuntime(): BoyleRuntimeState {
  return {
    volume: boylePhysicsConfig.volumeMax,
    thermalCondition: "equilibrium",
  };
}

function createInitialPreparation(): BoylePreparationState {
  return {
    selectedToolIds: [],
  };
}

function createInitialAssessment(): BoyleAssessmentState {
  return {
    answers: {},
    submitted: false,
  };
}

function getPhaseDefinition(phaseId: BoylePhaseId) {
  const phase = boylePhases.find(
    (candidate) => candidate.id === phaseId,
  );

  if (!phase) {
    throw new Error(
      `Unknown Boyle phase: ${phaseId}`,
    );
  }

  return phase;
}

function getAdjacentPhase(
  phaseId: BoylePhaseId,
  direction: -1 | 1,
): BoylePhaseId | null {
  const currentIndex =
    boylePhaseOrder.indexOf(phaseId);

  if (currentIndex < 0) {
    return null;
  }

  const targetId =
    boylePhaseOrder[currentIndex + direction];

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

export function useBoyleController() {
  const [activePhase, setActivePhase] =
    useState<BoylePhaseId>(
      boyleInitialPhaseId,
    );

  const [preparation, setPreparation] =
    useState<BoylePreparationState>(
      createInitialPreparation,
    );

  const [runtime, setRuntime] =
    useState<BoyleRuntimeState>(
      createInitialRuntime,
    );

  const [measurements, setMeasurements] =
    useState<BoyleMeasurement[]>([]);

  const [observations, setObservations] =
    useState<BoyleObservation[]>([]);

  const [assessment, setAssessment] =
    useState<BoyleAssessmentState>(
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
    phaseId: BoylePhaseId,
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

  const togglePreparationTool = (
    toolId: BoylePreparationToolId,
  ) => {
    setPreparation((current) => {
      const alreadySelected =
        current.selectedToolIds.includes(
          toolId,
        );

      if (alreadySelected) {
        return {
          selectedToolIds:
            current.selectedToolIds.filter(
              (id) => id !== toolId,
            ),
        };
      }

      return {
        selectedToolIds: [
          ...current.selectedToolIds,
          toolId,
        ],
      };
    });
  };

  const isPreparationComplete =
    useMemo(() => {
      const requiredToolIds =
        boylePreparationTools
          .filter((tool) => tool.correct)
          .map((tool) => tool.id);

      const selectedToolIds =
        preparation.selectedToolIds;

      if (
        selectedToolIds.length !==
        requiredToolIds.length
      ) {
        return false;
      }

      return requiredToolIds.every(
        (toolId) =>
          selectedToolIds.includes(
            toolId,
          ),
      );
    }, [preparation.selectedToolIds]);

  const setVolume = (
    volume: number,
  ) => {
    const clampedVolume = Math.min(
      boylePhysicsConfig.volumeMax,
      Math.max(
        boylePhysicsConfig.volumeMin,
        volume,
      ),
    );

    setRuntime((current) => ({
      ...current,
      volume: clampedVolume,
    }));
  };

  const setThermalCondition = (
    thermalCondition:
      BoyleThermalCondition,
  ) => {
    setRuntime((current) => ({
      ...current,
      thermalCondition,
    }));
  };

  const measurementLimitReached =
    measurements.length >=
    boylePhysicsConfig
      .targetMeasurementCount;

  const hasDuplicateMeasurement =
    measurements.some(
      (measurement) =>
        Math.abs(
          measurement.volume -
            runtime.volume,
        ) <
        boylePhysicsConfig
          .duplicateVolumeTolerance,
    );

  const canRecordMeasurement =
    runtime.thermalCondition ===
      "equilibrium" &&
    !measurementLimitReached &&
    !hasDuplicateMeasurement;

  const recordMeasurement =
    (): BoyleRecordMeasurementResult => {
      if (
        runtime.thermalCondition !==
        "equilibrium"
      ) {
        return "thermal-transient";
      }

      if (measurementLimitReached) {
        return "limit-reached";
      }

      if (hasDuplicateMeasurement) {
        return "duplicate-volume";
      }

      const measurement =
        createBoyleMeasurement(
          runtime.volume,
          boylePhysicsConfig
            .boyleConstant,
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

  const setObservationResponse = (
    id: BoyleObservationId,
    response: string,
  ) => {
    setObservations((current) => {
      const existing =
        current.some(
          (observation) =>
            observation.id === id,
        );

      if (!existing) {
        return [
          ...current,
          {
            id,
            response,
          },
        ];
      }

      return current.map(
        (observation) =>
          observation.id === id
            ? {
                ...observation,
                response,
              }
            : observation,
      );
    });
  };

  const setAssessmentAnswer = (
    questionId: BoyleQuestionId,
    answer: BoyleAnswerIndex,
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
    boyleAssessmentQuestions.every(
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
        boyleAssessmentQuestions.reduce(
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

  const applyFirePistonCompression =
    () => {
      if (
        runtime.thermalCondition !==
        "equilibrium"
      ) {
        return false;
      }

      setRuntime({
        volume:
          boylePhysicsConfig.volumeMin,
        thermalCondition: "transient",
      });

      return true;
    };

  const resetRuntime = () => {
    setRuntime(
      createInitialRuntime(),
    );
  };

  const resetExperiment = () => {
    setActivePhase(
      boyleInitialPhaseId,
    );

    setPreparation(
      createInitialPreparation(),
    );

    setRuntime(
      createInitialRuntime(),
    );

    setMeasurements([]);
    setObservations([]);

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
    togglePreparationTool,

    runtime,
    setVolume,
    setThermalCondition,

    measurements,
    measurementLimitReached,
    hasDuplicateMeasurement,
    canRecordMeasurement,
    recordMeasurement,
    clearMeasurements,

    observations,
    setObservationResponse,

    assessment,
    canSubmitAssessment,
    assessmentScore,
    setAssessmentAnswer,
    submitAssessment,

    applyFirePistonCompression,

    resetRuntime,
    resetExperiment,
  };
}