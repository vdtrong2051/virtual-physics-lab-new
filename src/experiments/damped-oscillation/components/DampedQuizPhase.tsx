import ExperimentQuiz from "../../../components/experiment/ExperimentQuiz";
import Button from "../../../components/ui/Button";

import {
  dampedAssessmentQuestions,
} from "../data";

import type {
  DampedAnswerIndex,
  DampedAssessmentState,
  DampedQuestionId,
} from "../model";

type DampedQuizPhaseProps = {
  assessment: DampedAssessmentState;
  score: number;
  onAnswer: (
    questionId: DampedQuestionId,
    answer: DampedAnswerIndex,
  ) => void;
  onSubmit: () => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function DampedQuizPhase({
  assessment,
  score,
  onAnswer,
  onSubmit,
  onBack,
  onContinue,
}: DampedQuizPhaseProps) {
  return (
    <div className="damped-content-phase damped-quiz">
      <div className="damped-content-phase__inner">
        <span className="damped-content-phase__badge">
          Phần 5 · Luyện tập
        </span>

        <header className="damped-quiz__heading">
          <h2>Bài tập Luyện tập</h2>

          <p>
            Chọn đáp án phù hợp, sau đó nộp bài
            để xem đáp án đúng và phần giải thích.
          </p>
        </header>

        <ExperimentQuiz
          className="damped-quiz"
          questions={
            dampedAssessmentQuestions
          }
          assessment={assessment}
          onAnswer={onAnswer}
          keepSelectedAfterSubmit
          muteUnselectedAfterSubmit
          renderQuestionHeader={({
            question,
            questionIndex,
          }) => (
            <h3>
              Câu {questionIndex + 1}:{" "}
              {question.prompt}
            </h3>
          )}
          renderOptionContent={({
            option,
            submitted,
            isCorrect,
            isWrongSelected,
          }) => (
            <>
              <span>{option}</span>

              {submitted && isCorrect && (
                <b aria-label="Đáp án đúng">
                  ✓
                </b>
              )}

              {submitted &&
                isWrongSelected && (
                  <b aria-label="Đáp án sai">
                    ✕
                  </b>
                )}
            </>
          )}
          renderQuestionFooter={({
            question,
            submitted,
          }) =>
            submitted ? (
              <p className="damped-quiz-card__explanation">
                <strong>Giải thích:</strong>{" "}
                {question.explanation}
              </p>
            ) : null
          }
        />

        {assessment.submitted && (
          <div
            className="damped-quiz__result"
            aria-live="polite"
          >
            Kết quả:{" "}
            <strong>
              {score} /{
              " "
              }
              {
                dampedAssessmentQuestions.length
              }
            </strong>
          </div>
        )}

        <div className="damped-phase-actions">
          <Button
            type="button"
            className="damped-button damped-button--secondary"
            onClick={onBack}
          >
            ← Quay lại
          </Button>

          {!assessment.submitted ? (
            <Button
              type="button"
              className="damped-button damped-button--primary"
              onClick={onSubmit}
            >
              Nộp bài
            </Button>
          ) : (
            <Button
              type="button"
              className="damped-button damped-button--success"
              onClick={onContinue}
            >
              Viết Báo cáo →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
