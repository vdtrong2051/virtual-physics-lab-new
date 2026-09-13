export type BoylePhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type BoylePhaseDefinition = {
  id: BoylePhaseId;
  label: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

export type BoyleThermalCondition =
  | "equilibrium"
  | "transient";

export type BoyleRuntimeState = {
  volume: number;
  thermalCondition: BoyleThermalCondition;
};

export type BoylePreparationToolId =
  | "set_boyle"
  | "stand"
  | "clamp"
  | "calorimeter"
  | "balance"
  | "flask";

export type BoylePreparationToolDefinition = {
  id: BoylePreparationToolId;
  name: string;
  icon: string;
  correct: boolean;
};

export type BoylePreparationState = {
  selectedToolIds: BoylePreparationToolId[];
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
  | 0
  | 1
  | 2
  | 3;

export type BoyleAssessmentQuestion = {
  id: BoyleQuestionId;
  prompt: string;
  options: readonly [
    string,
    string,
    string,
    string
  ];
  correctOption: BoyleAnswerIndex;
};

export type BoyleAssessmentState = {
  answers: Partial<
    Record<BoyleQuestionId, BoyleAnswerIndex>
  >;
  submitted: boolean;
};