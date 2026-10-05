import type { ExperimentAnswerIndex, ExperimentAssessmentQuestion, ExperimentAssessmentState, ExperimentPhaseDefinition } from "../shared/model";

export type HarmonicPhaseId = "intro" | "prep" | "prac" | "conc" | "test" | "report";
export type HarmonicRuntimeState = { isPlaying: boolean; speed: number; amplitude: number; showRays: boolean };
export type HarmonicQuestionId = "q1" | "q2";
export type HarmonicAnswerIndex = ExperimentAnswerIndex;
export type HarmonicAssessmentQuestion = ExperimentAssessmentQuestion<HarmonicQuestionId> & { explanation: string };
export type HarmonicAssessmentState = ExperimentAssessmentState<HarmonicQuestionId>;
export type HarmonicPhaseDefinition = ExperimentPhaseDefinition<HarmonicPhaseId>;
