import type {
  ExperimentAnswerIndex,
  ExperimentAssessmentQuestion,
  ExperimentAssessmentState,
  ExperimentPhaseDefinition,
  ExperimentPreparationToolDefinition,
} from "../shared/model";

export type BoylePhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type BoylePhaseDefinition =
  ExperimentPhaseDefinition<
    BoylePhaseId
  >;

export type BoyleThermalCondition =
  | "equilibrium"
  | "transient";

export type BoyleRuntimeState = {
  volume: number;
  thermalCondition:
    BoyleThermalCondition;
};

export type BoylePreparationToolId =
  | "set_boyle"
  | "stand"
  | "clamp"
  | "calorimeter"
  | "balance"
  | "flask";

export type BoylePreparationToolDefinition =
  ExperimentPreparationToolDefinition<
    BoylePreparationToolId
  >;

export type BoylePreparationState = {
  selectedToolIds:
    BoylePreparationToolId[];
};

export type BoyleMeasurement = {
  volume: number;
  pressure: number;
  pressureVolume: number;
};

export type BoyleObservationId =
  | "pressure-volume-relationship"
  | "microscopic-explanation";

export type BoyleObservation = {
  id: BoyleObservationId;
  response: string;
};

export type BoyleQuestionId =
  | "q1"
  | "q2"
  | "q3"
  | "q4";

export type BoyleAnswerIndex =
  ExperimentAnswerIndex;

export type BoyleAssessmentQuestion =
  ExperimentAssessmentQuestion<
    BoyleQuestionId
  >;

export type BoyleAssessmentState =
  ExperimentAssessmentState<
    BoyleQuestionId
  >;