import ExperimentQuiz from "../../../components/experiment/ExperimentQuiz";
import Button from "../../../components/ui/Button";

import {
  jouleAssessmentQuestions,
} from "../data";

import type {
  JouleAnswerIndex,
  JouleAssessmentState,
  JouleQuestionId,
} from "../model";

type JouleQuizPhaseProps = {
  assessment: JouleAssessmentState;

  canSubmit: boolean;

  score: number;

  onAnswer: (
    questionId: JouleQuestionId,
    answer: JouleAnswerIndex,
  ) => void;

  onSubmit: () => boolean;

  onBack: () => void;

  onContinue: () => void;
};

export default function JouleQuizPhase({
  assessment,
  canSubmit,
  score,
  onAnswer,
  onSubmit,
  onBack,
  onContinue,
}: JouleQuizPhaseProps) {
  const totalQuestions =
    jouleAssessmentQuestions.length;

  const answeredCount =
    jouleAssessmentQuestions.filter(
      (question) =>
        assessment.answers[
          question.id
        ] !== undefined,
    ).length;

  const isPerfectScore =
    score === totalQuestions;

  return (
    <div className="joule-content-phase">
      <div className="joule-content-phase__inner">
        <span className="joule-content-phase__badge">
          Phần 5 · Luyện tập
        </span>

        <div className="joule-quiz__heading">
          <div>
            <h2>
              Kiểm tra kiến thức
            </h2>

            <p>
              Trả lời các câu hỏi về sự
              chuyển hóa cơ năng thành
              nội năng và định luật bảo
              toàn năng lượng trong thí
              nghiệm Joule.
            </p>
          </div>

          <div className="joule-quiz__progress">
            <span>
              Đã trả lời
            </span>

            <strong>
              {answeredCount}
              {" / "}
              {totalQuestions}
            </strong>
          </div>
        </div>

        <ExperimentQuiz
          className="joule-quiz"
          cardAs="article"
          questions={
            jouleAssessmentQuestions
          }
          assessment={assessment}
          onAnswer={onAnswer}
          muteUnselectedAfterSubmit
          renderQuestionHeader={({
            question,
            questionIndex,
          }) => (
            <div className="joule-quiz-card__heading">
              <span>
                Câu{" "}
                {questionIndex + 1}
              </span>

              <h3>
                {question.prompt}
              </h3>
            </div>
          )}
          renderOptionContent={({
            option,
            isCorrect,
            isWrongSelected,
          }) => (
            <>
              <span className="joule-quiz-option__text">
                {option}
              </span>

              {isCorrect && (
                <span
                  className="joule-quiz-option__mark"
                  aria-label="Đáp án đúng"
                >
                  ✓
                </span>
              )}

              {isWrongSelected && (
                <span
                  className="joule-quiz-option__mark"
                  aria-label="Đáp án đã chọn sai"
                >
                  ✕
                </span>
              )}
            </>
          )}
        />

        {assessment.submitted && (
          <section
            className={`joule-quiz-result ${
              isPerfectScore
                ? "joule-quiz-result--perfect"
                : ""
            }`}
            aria-live="polite"
          >
            <div>
              <span>
                Kết quả đánh giá
              </span>

              <strong>
                {score}
                {" / "}
                {totalQuestions}
              </strong>
            </div>

            <p>
              {isPerfectScore
                ? "Bạn đã trả lời đúng toàn bộ câu hỏi."
                : "Có câu trả lời chưa chính xác. Đáp án đúng đã được đánh dấu để đối chiếu."}
            </p>
          </section>
        )}

        <div className="joule-phase-actions">
          <Button
            type="button"
            className="experiment-template__button"
            onClick={onBack}
          >
            Quay lại kết luận
          </Button>

          {!assessment.submitted ? (
            <Button
              type="button"
              className="experiment-template__button experiment-template__button--primary"
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              Nộp bài
            </Button>
          ) : (
            <Button
              type="button"
              className="experiment-template__button experiment-template__button--primary"
              onClick={onContinue}
            >
              Sang báo cáo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}