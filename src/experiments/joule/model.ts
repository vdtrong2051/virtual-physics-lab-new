import type {
  ExperimentAnswerIndex,
  ExperimentAssessmentQuestion,
  ExperimentAssessmentState,
  ExperimentPhaseDefinition,
  ExperimentPreparationToolDefinition,
} from "../shared/model";

export type JoulePhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type JoulePhaseDefinition =
  ExperimentPhaseDefinition<
    JoulePhaseId
  >;

export type JouleMotionPhase =
  | "idle"
  | "falling"
  | "spinning"
  | "finished";

export type JouleRuntimeState = {
  massPerSideKg: number;
  dropHeightM: number;
  motionPhase: JouleMotionPhase;
};

export type JoulePreparationToolId =
  | "stand"
  | "calorimeter"
  | "water"
  | "paddle"
  | "weights"
  | "burner"
  | "scale"
  | "beaker";

export type JoulePreparationToolDefinition =
  ExperimentPreparationToolDefinition<
    JoulePreparationToolId
  >;

export type JoulePreparationState = {
  selectedToolIds:
    JoulePreparationToolId[];
};

export type JouleMeasurement = {
  totalMassKg: number;
  dropHeightM: number;
  mechanicalWorkJ: number;
  temperatureRiseC: number;
};

export type JouleQuestionId =
  | "q1"
  | "q2"
  | "q3";

export type JouleAnswerIndex =
  ExperimentAnswerIndex;

export type JouleAssessmentQuestion =
  ExperimentAssessmentQuestion<
    JouleQuestionId
  >;

export type JouleAssessmentState =
  ExperimentAssessmentState<
    JouleQuestionId
  >;