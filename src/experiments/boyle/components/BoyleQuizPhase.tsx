import ExperimentQuiz from "../../../components/experiment/ExperimentQuiz";
import Button from "../../../components/ui/Button";

import {
  boyleAssessmentQuestions,
} from "../data";

import type {
  BoyleAnswerIndex,
  BoyleAssessmentState,
  BoyleQuestionId,
} from "../model";

type BoyleQuizPhaseProps = {
  assessment: BoyleAssessmentState;

  canSubmit: boolean;

  score: number;

  onAnswer: (
    questionId: BoyleQuestionId,
    answer: BoyleAnswerIndex,
  ) => void;

  onSubmit: () => boolean;

  onBack: () => void;
  onContinue: () => void;
};

export default function BoyleQuizPhase({
  assessment,
  canSubmit,
  score,
  onAnswer,
  onSubmit,
  onBack,
  onContinue,
}: BoyleQuizPhaseProps) {
  const totalQuestions =
    boyleAssessmentQuestions.length;

  function handleSubmit() {
    onSubmit();
  }

  return (
    <div className="boyle-quiz">
      <div className="boyle-quiz__inner">
        <span className="boyle-content-phase__badge">
          Phần 5 · Luyện tập
        </span>

        <div className="boyle-quiz__heading">
          <h3>
            Kiểm tra kiến thức
          </h3>

          <p>
            Chọn một đáp án cho mỗi câu hỏi.
            Sau khi nộp bài, đáp án sẽ được khóa.
          </p>
        </div>

        <ExperimentQuiz
          className="boyle-quiz"
          cardAs="section"
          questions={
            boyleAssessmentQuestions
          }
          assessment={assessment}
          onAnswer={onAnswer}
          keepSelectedAfterSubmit
          renderQuestionHeader={({
            question,
            questionIndex,
            submitted,
            isQuestionCorrect,
          }) => (
            <>
              <div className="boyle-quiz-card__header">
                <span>
                  Câu{" "}
                  {questionIndex + 1}
                </span>

                {submitted && (
                  <strong
                    className={
                      isQuestionCorrect
                        ? "boyle-quiz-card__result boyle-quiz-card__result--correct"
                        : "boyle-quiz-card__result boyle-quiz-card__result--wrong"
                    }
                  >
                    {isQuestionCorrect
                      ? "Đúng"
                      : "Sai"}
                  </strong>
                )}
              </div>

              <h4>
                {question.prompt}
              </h4>
            </>
          )}
          renderOptionContent={({
            option,
            optionIndex,
          }) => (
            <>
              <span className="boyle-quiz-option__marker">
                {String.fromCharCode(
                  65 + optionIndex,
                )}
              </span>

              <span>
                {option.replace(
                  /^[A-D]\.\s*/,
                  "",
                )}
              </span>
            </>
          )}
        />

        {!assessment.submitted ? (
          <div className="boyle-quiz__submit">
            <Button
              type="button"
              className="experiment-template__button experiment-template__button--primary"
              disabled={!canSubmit}
              onClick={
                handleSubmit
              }
            >
              Nộp bài
            </Button>

            {!canSubmit && (
              <span>
                Hãy trả lời đủ{" "}
                {totalQuestions} câu
                trước khi nộp.
              </span>
            )}
          </div>
        ) : (
          <div className="boyle-quiz-score">
            <span>
              Kết quả
            </span>

            <strong>
              {score}
              {" / "}
              {totalQuestions}
            </strong>

            <p>
              Bạn có thể xem lại đáp án
              trước khi chuyển sang báo cáo.
            </p>
          </div>
        )}

        <div className="boyle-phase-actions">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={onBack}
          >
            Quay lại kết luận
          </Button>

          <Button
            type="button"
            className="experiment-template__button experiment-template__button--primary"
            disabled={
              !assessment.submitted
            }
            onClick={
              onContinue
            }
          >
            Chuyển sang báo cáo
          </Button>
        </div>
      </div>
    </div>
  );
}