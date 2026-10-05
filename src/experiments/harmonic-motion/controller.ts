import { useMemo, useState } from "react";
import { createHarmonicRuntime, harmonicPhaseOrder, harmonicPhases, harmonicQuestions } from "./data";
import type { HarmonicAnswerIndex, HarmonicAssessmentState, HarmonicPhaseId, HarmonicQuestionId } from "./model";

const initialAssessment = (): HarmonicAssessmentState => ({ answers: {}, submitted: false });
export function useHarmonicController() {
  const [activePhase, setActivePhase] = useState<HarmonicPhaseId>("intro");
  const [runtime, setRuntime] = useState(createHarmonicRuntime);
  const [assessment, setAssessment] = useState<HarmonicAssessmentState>(initialAssessment);
  const index = harmonicPhaseOrder.indexOf(activePhase);
  const goToPhase = (id: HarmonicPhaseId) => { if (harmonicPhases.some((phase) => phase.id === id)) setActivePhase(id); };
  const goToPreviousPhase = () => setActivePhase(harmonicPhaseOrder[Math.max(0, index - 1)]);
  const goToNextPhase = () => setActivePhase(harmonicPhaseOrder[Math.min(harmonicPhaseOrder.length - 1, index + 1)]);
  const togglePlayback = () => setRuntime((current) => ({ ...current, isPlaying: !current.isPlaying }));
  const toggleRays = () => setRuntime((current) => ({ ...current, showRays: !current.showRays }));
  const setSpeed = (speed: number) => setRuntime((current) => ({ ...current, speed: Math.min(4, Math.max(.5, speed)) }));
  const setAmplitude = (amplitude: number) => setRuntime((current) => ({ ...current, amplitude: Math.min(3.5, Math.max(1.5, amplitude)) }));
  const setAssessmentAnswer = (id: HarmonicQuestionId, answer: HarmonicAnswerIndex) => setAssessment((current) => current.submitted ? current : ({ ...current, answers: { ...current.answers, [id]: answer } }));
  const submitAssessment = () => setAssessment((current) => ({ ...current, submitted: true }));
  const score = useMemo(() => harmonicQuestions.reduce((total, question) => total + (assessment.answers[question.id] === question.correctOption ? 1 : 0), 0), [assessment.answers]);
  const resetExperiment = () => { setActivePhase("intro"); setRuntime(createHarmonicRuntime()); setAssessment(initialAssessment()); };
  return { activePhase, runtime, assessment, score, goToPhase, goToPreviousPhase, goToNextPhase, togglePlayback, toggleRays, setSpeed, setAmplitude, setAssessmentAnswer, submitAssessment, resetExperiment };
}
