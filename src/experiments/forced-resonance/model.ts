import type {
  ExperimentAnswerIndex,
  ExperimentAssessmentQuestion,
  ExperimentAssessmentState,
  ExperimentPhaseDefinition,
} from "../shared/model";

export type ForcedPhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type ForcedPendulumState = {
  length: number;
  posX: number;
};

export type ForcedRuntimeState = {
  isPlaying: boolean;
  resetVersion: number;
  isCameraLocked: boolean;
  driver: ForcedPendulumState;
  p1: ForcedPendulumState;
  p2: ForcedPendulumState;
  p3: ForcedPendulumState;
};

export type ForcedQuestionId = "q1" | "q2";
export type ForcedAnswerIndex = ExperimentAnswerIndex;
export type ForcedAssessmentQuestion =
  ExperimentAssessmentQuestion<ForcedQuestionId> & {
    explanation: string;
  };
export type ForcedAssessmentState =
  ExperimentAssessmentState<ForcedQuestionId>;
export type ForcedPhaseDefinition =
  ExperimentPhaseDefinition<ForcedPhaseId>;
