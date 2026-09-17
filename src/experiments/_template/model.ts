import type {
  ExperimentAssessmentState as SharedExperimentAssessmentState,
  ExperimentPhaseDefinition as SharedExperimentPhaseDefinition,
} from "../shared/model";

export type ExperimentPhaseId =
  | "intro"
  | "prep"
  | "prac"
  | "conc"
  | "test"
  | "report";

export type ExperimentPhaseDefinition<
  TPhaseId extends string,
> =
  SharedExperimentPhaseDefinition<
    TPhaseId
  >;

declare const templateRuntimeMarker:
  unique symbol;

declare const templateMeasurementMarker:
  unique symbol;

declare const templateObservationMarker:
  unique symbol;

// TODO:
// Mỗi thí nghiệm thật phải định nghĩa
// runtime state riêng.
export type TemplateRuntimeState = {
  readonly [templateRuntimeMarker]?: never;
};

// TODO:
// Mỗi thí nghiệm thật phải định nghĩa
// measurement riêng.
export type TemplateMeasurement = {
  readonly [templateMeasurementMarker]?: never;
};

// TODO:
// Chỉ dùng nếu thí nghiệm có phần
// ghi nhận quan sát của người học.
export type TemplateObservation = {
  readonly [templateObservationMarker]?: never;
};

// Template mặc định dùng dạng câu hỏi
// trắc nghiệm chuẩn của hệ thống.
export type TemplateAssessmentState =
  SharedExperimentAssessmentState<
    string
  >;