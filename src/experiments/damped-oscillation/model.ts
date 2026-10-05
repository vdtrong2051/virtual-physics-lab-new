import type {
  ExperimentAnswerIndex,
  ExperimentAssessmentQuestion,
  ExperimentAssessmentState,
  ExperimentPhaseDefinition,
} from "../shared/model";

export type DampedPhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type DampedPhaseDefinition =
  ExperimentPhaseDefinition<DampedPhaseId>;

export type DampedRuntimeState = {
  damping: number;
  paperSpeed: number;
  isPlaying: boolean;
  hasStarted: boolean;
  resetVersion: number;
  isCameraLocked: boolean;
};

export type DampedSnapshot = {
  id: number;
  url: string;
  damping: number;
};

export type DampedQuestionId =
  | "q1"
  | "q2";

export type DampedAnswerIndex =
  ExperimentAnswerIndex;

export type DampedAssessmentQuestion =
  ExperimentAssessmentQuestion<DampedQuestionId> & {
    explanation: string;
  };

export type DampedAssessmentState =
  ExperimentAssessmentState<DampedQuestionId>;
