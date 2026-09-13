export type ExperimentPhaseId =
  | "intro"
  | "preparation"
  | "experiment"
  | "conclusion"
  | "practice"
  | "report";

export type ExperimentPhaseDefinition<TPhaseId extends string> = {
  id: TPhaseId;
  label: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

declare const templateRuntimeMarker: unique symbol;
declare const templateMeasurementMarker: unique symbol;
declare const templateObservationMarker: unique symbol;

// TODO: Mỗi thí nghiệm thật cần thay thế hoặc mở rộng shape runtime này.
export type TemplateRuntimeState = {
  readonly [templateRuntimeMarker]?: never;
};

// TODO: Mỗi thí nghiệm thật cần thay thế hoặc mở rộng shape measurement này.
export type TemplateMeasurement = {
  readonly [templateMeasurementMarker]?: never;
};

// TODO: Mỗi thí nghiệm thật cần thay thế hoặc mở rộng shape observation này.
export type TemplateObservation = {
  readonly [templateObservationMarker]?: never;
};

// TODO: Mỗi thí nghiệm thật cần thay thế hoặc mở rộng shape assessment này.
export type TemplateAssessmentState = {
  answers: Record<string, unknown>;
  submitted: boolean;
};
