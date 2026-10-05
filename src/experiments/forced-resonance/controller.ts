import { useMemo, useState } from "react";

import {
  createForcedRuntime,
  forcedPhaseOrder,
  forcedPhases,
  forcedQuestions,
} from "./data";
import type {
  ForcedAnswerIndex,
  ForcedAssessmentState,
  ForcedPendulumState,
  ForcedPhaseId,
  ForcedQuestionId,
} from "./model";

const initialAssessment = (): ForcedAssessmentState => ({ answers: {}, submitted: false });

export function useForcedController() {
  const [activePhase, setActivePhase] = useState<ForcedPhaseId>("intro");
  const [runtime, setRuntime] = useState(createForcedRuntime);
  const [assessment, setAssessment] = useState<ForcedAssessmentState>(initialAssessment);
  const phaseIndex = forcedPhaseOrder.indexOf(activePhase);

  const goToPhase = (phaseId: ForcedPhaseId) => {
    if (forcedPhases.some((phase) => phase.id === phaseId)) setActivePhase(phaseId);
  };
  const goToPreviousPhase = () => setActivePhase(forcedPhaseOrder[Math.max(0, phaseIndex - 1)]);
  const goToNextPhase = () => setActivePhase(forcedPhaseOrder[Math.min(forcedPhaseOrder.length - 1, phaseIndex + 1)]);
  const togglePlayback = () => setRuntime((current) => ({
    ...current,
    isPlaying: !current.isPlaying,
    resetVersion: current.isPlaying ? current.resetVersion + 1 : current.resetVersion,
  }));
  const toggleCameraLock = () => setRuntime((current) => ({ ...current, isCameraLocked: !current.isCameraLocked }));
  const updatePendulum = (key: "driver" | "p1" | "p2" | "p3", value: ForcedPendulumState) =>
    setRuntime((current) => current.isPlaying ? current : ({ ...current, [key]: value }));
  const setAssessmentAnswer = (questionId: ForcedQuestionId, answer: ForcedAnswerIndex) =>
    setAssessment((current) => current.submitted ? current : ({ ...current, answers: { ...current.answers, [questionId]: answer } }));
  const submitAssessment = () => setAssessment((current) => ({ ...current, submitted: true }));
  const score = useMemo(() => forcedQuestions.reduce(
    (total, question) => total + (assessment.answers[question.id] === question.correctOption ? 1 : 0), 0,
  ), [assessment.answers]);
  const resetExperiment = () => {
    setActivePhase("intro");
    setRuntime(createForcedRuntime());
    setAssessment(initialAssessment());
  };

  return {
    activePhase, runtime, assessment, score, goToPhase, goToPreviousPhase,
    goToNextPhase, togglePlayback, toggleCameraLock, updatePendulum,
    setAssessmentAnswer, submitAssessment, resetExperiment,
  };
}
