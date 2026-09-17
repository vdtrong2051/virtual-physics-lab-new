export type ExperimentPhaseDefinition<
  TPhaseId extends string,
> = {
  id: TPhaseId;
  label: string;
  title: string;
  description?: string;
  disabled?: boolean;
};

export type ExperimentAnswerIndex =
  | 0
  | 1
  | 2
  | 3;

export type ExperimentAssessmentQuestion<
  TQuestionId extends string,
> = {
  id: TQuestionId;
  prompt: string;
  options: readonly [
    string,
    string,
    string,
    string,
  ];
  correctOption: ExperimentAnswerIndex;
};

export type ExperimentAssessmentState<
  TQuestionId extends string,
> = {
  answers: Partial<
    Record<
      TQuestionId,
      ExperimentAnswerIndex
    >
  >;
  submitted: boolean;
};

export type ExperimentPreparationToolDefinition<
  TToolId extends string,
> = {
  id: TToolId;
  name: string;
  icon: string;
  description?: string;
  correct: boolean;
};