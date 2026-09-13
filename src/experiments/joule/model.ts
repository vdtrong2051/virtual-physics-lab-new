export type JoulePhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type JoulePhaseDefinition = {
  id: JoulePhaseId;
  label: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

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

export type JoulePreparationToolDefinition = {
  id: JoulePreparationToolId;
  name: string;
  description: string;
  icon: string;
  correct: boolean;
};

export type JoulePreparationState = {
  selectedToolIds: JoulePreparationToolId[];
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
  | 0
  | 1
  | 2
  | 3;

export type JouleAssessmentQuestion = {
  id: JouleQuestionId;
  prompt: string;
  options: readonly [
    string,
    string,
    string,
    string
  ];
  correctOption: JouleAnswerIndex;
};

export type JouleAssessmentState = {
  answers: Partial<
    Record<JouleQuestionId, JouleAnswerIndex>
  >;
  submitted: boolean;
};
