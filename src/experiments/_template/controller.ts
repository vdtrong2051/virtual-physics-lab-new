import { useState } from "react";

import {
  experimentPhaseOrder,
  experimentPhases,
  getExperimentPhase,
  initialPhaseId,
} from "./data";

import type {
  ExperimentPhaseId,
  TemplateAssessmentState,
  TemplateMeasurement,
  TemplateObservation,
  TemplateRuntimeState,
} from "./model";

function createInitialRuntime(): TemplateRuntimeState {
  return {};
}

function createInitialAssessment(): TemplateAssessmentState {
  return {
    answers: {},
    submitted: false,
  };
}

function isPhaseDisabled(phaseId: ExperimentPhaseId) {
  return Boolean(getExperimentPhase(phaseId)?.disabled);
}

function getAdjacentPhaseId(
  activePhase: ExperimentPhaseId,
  direction: 1 | -1
) {
  const activePhaseIndex =
    experimentPhaseOrder.indexOf(activePhase);

  return experimentPhaseOrder[
    activePhaseIndex + direction
  ];
}

export function useExperimentController() {
  const [activePhase, setActivePhase] =
    useState<ExperimentPhaseId>(initialPhaseId);

  const [runtime, setRuntime] =
    useState<TemplateRuntimeState>(
      createInitialRuntime
    );

  const [measurements, setMeasurements] =
    useState<TemplateMeasurement[]>([]);

  const [observations, setObservations] =
    useState<TemplateObservation[]>([]);

  const [assessment, setAssessment] =
    useState<TemplateAssessmentState>(
      createInitialAssessment
    );

  const activePhaseDefinition =
    getExperimentPhase(activePhase) ??
    experimentPhases[0];

  const nextPhaseId =
    getAdjacentPhaseId(activePhase, 1);

  const previousPhaseId =
    getAdjacentPhaseId(activePhase, -1);

  const canGoNext =
    Boolean(nextPhaseId) &&
    !isPhaseDisabled(nextPhaseId);

  const canGoPrevious =
    Boolean(previousPhaseId) &&
    !isPhaseDisabled(previousPhaseId);

  function goToPhase(phaseId: ExperimentPhaseId) {
    const targetPhase =
      getExperimentPhase(phaseId);

    if (!targetPhase || targetPhase.disabled) {
      return;
    }

    setActivePhase(targetPhase.id);
  }

  function goToNextPhase() {
    if (!nextPhaseId || isPhaseDisabled(nextPhaseId)) {
      return;
    }

    setActivePhase(nextPhaseId);
  }

  function goToPreviousPhase() {
    if (
      !previousPhaseId ||
      isPhaseDisabled(previousPhaseId)
    ) {
      return;
    }

    setActivePhase(previousPhaseId);
  }

  function resetRuntime() {
    setRuntime(createInitialRuntime());
  }

  function resetExperiment() {
    setActivePhase(initialPhaseId);
    setRuntime(createInitialRuntime());
    setMeasurements([]);
    setObservations([]);
    setAssessment(createInitialAssessment());
  }

  return {
    activePhase,
    activePhaseDefinition,
    goToPhase,
    goToNextPhase,
    goToPreviousPhase,
    canGoNext,
    canGoPrevious,
    runtime,
    measurements,
    observations,
    assessment,
    resetRuntime,
    resetExperiment,
  };
}
