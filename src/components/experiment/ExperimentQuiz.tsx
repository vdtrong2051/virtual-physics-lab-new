import type {
  ReactNode,
} from "react";

import Button from "../ui/Button";

import type {
  ExperimentAnswerIndex,
  ExperimentAssessmentQuestion,
  ExperimentAssessmentState,
} from "../../experiments/shared/model";

export type ExperimentQuizQuestionContext<
  TQuestionId extends string,
> = {
  question:
    ExperimentAssessmentQuestion<
      TQuestionId
    >;

  questionIndex: number;

  selectedAnswer:
    | ExperimentAnswerIndex
    | undefined;

  submitted: boolean;

  isQuestionCorrect: boolean;
};

export type ExperimentQuizOptionContext<
  TQuestionId extends string,
> = {
  question:
    ExperimentAssessmentQuestion<
      TQuestionId
    >;

  questionIndex: number;

  option: string;

  optionIndex:
    ExperimentAnswerIndex;

  selectedAnswer:
    | ExperimentAnswerIndex
    | undefined;

  submitted: boolean;

  isSelected: boolean;

  isCorrect: boolean;

  isWrongSelected: boolean;
};

export type ExperimentQuizProps<
  TQuestionId extends string,
> = {
  className: string;

  cardAs?:
    | "section"
    | "article";

  questions: readonly ExperimentAssessmentQuestion<
    TQuestionId
  >[];

  assessment:
    ExperimentAssessmentState<
      TQuestionId
    >;

  onAnswer: (
    questionId: TQuestionId,
    answer:
      ExperimentAnswerIndex,
  ) => void;

  keepSelectedAfterSubmit?: boolean;

  muteUnselectedAfterSubmit?: boolean;

  renderQuestionHeader: (
    context:
      ExperimentQuizQuestionContext<
        TQuestionId
      >,
  ) => ReactNode;

  renderOptionContent: (
    context:
      ExperimentQuizOptionContext<
        TQuestionId
      >,
  ) => ReactNode;
};

export default function ExperimentQuiz<
  TQuestionId extends string,
>({
  className,
  cardAs = "section",
  questions,
  assessment,
  onAnswer,
  keepSelectedAfterSubmit = false,
  muteUnselectedAfterSubmit = false,
  renderQuestionHeader,
  renderOptionContent,
}: ExperimentQuizProps<TQuestionId>) {
  const Card = cardAs;

  return (
    <div
      className={`${className}__questions`}
    >
      {questions.map(
        (
          question,
          questionIndex,
        ) => {
          const selectedAnswer =
            assessment.answers[
              question.id
            ];

          const isQuestionCorrect =
            assessment.submitted &&
            selectedAnswer ===
              question.correctOption;

          return (
            <Card
              key={question.id}
              className={`${className}-card`}
            >
              {renderQuestionHeader({
                question,
                questionIndex,
                selectedAnswer,
                submitted:
                  assessment.submitted,
                isQuestionCorrect,
              })}

              <div
                className={`${className}-options`}
              >
                {question.options.map(
                  (
                    option,
                    rawOptionIndex,
                  ) => {
                    const optionIndex =
                      rawOptionIndex as ExperimentAnswerIndex;

                    const isSelected =
                      selectedAnswer ===
                      optionIndex;

                    const isCorrect =
                      assessment.submitted &&
                      optionIndex ===
                        question.correctOption;

                    const isWrongSelected =
                      assessment.submitted &&
                      isSelected &&
                      !isCorrect;

                    const showSelected =
                      isSelected &&
                      (
                        !assessment.submitted ||
                        keepSelectedAfterSubmit
                      );

                    const isMuted =
                      assessment.submitted &&
                      muteUnselectedAfterSubmit &&
                      !isCorrect &&
                      !isWrongSelected;

                    const optionClassName = [
                      `${className}-option`,

                      showSelected
                        ? `${className}-option--selected`
                        : "",

                      isCorrect
                        ? `${className}-option--correct`
                        : "",

                      isWrongSelected
                        ? `${className}-option--wrong`
                        : "",

                      isMuted
                        ? `${className}-option--muted`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <Button
                        key={`${question.id}-${optionIndex}`}
                        type="button"
                        className={
                          optionClassName
                        }
                        disabled={
                          assessment.submitted
                        }
                        aria-pressed={
                          isSelected
                        }
                        onClick={() =>
                          onAnswer(
                            question.id,
                            optionIndex,
                          )
                        }
                      >
                        {renderOptionContent({
                          question,
                          questionIndex,
                          option,
                          optionIndex,
                          selectedAnswer,
                          submitted:
                            assessment.submitted,
                          isSelected,
                          isCorrect,
                          isWrongSelected,
                        })}
                      </Button>
                    );
                  },
                )}
              </div>
            </Card>
          );
        },
      )}
    </div>
  );
}