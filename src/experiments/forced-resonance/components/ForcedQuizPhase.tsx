import Button from "../../../components/ui/Button";
import ExperimentQuiz from "../../../components/experiment/ExperimentQuiz";
import { forcedQuestions } from "../data";
import type { ForcedAnswerIndex, ForcedAssessmentState, ForcedQuestionId } from "../model";

export default function ForcedQuizPhase({ assessment, score, onAnswer, onSubmit, onBack, onContinue }: {
  assessment: ForcedAssessmentState; score: number; onAnswer: (id: ForcedQuestionId, answer: ForcedAnswerIndex) => void; onSubmit: () => void; onBack: () => void; onContinue: () => void;
}) {
  return <div className="forced-content forced-quiz"><div className="forced-content__inner forced-content__inner--quiz">
    <h2>5. Bài tập Luyện tập</h2>
    <ExperimentQuiz className="forced-quiz" questions={forcedQuestions} assessment={assessment} onAnswer={onAnswer}
      renderQuestionHeader={({ question, questionIndex }) => <h3>Câu {questionIndex + 1}: {question.prompt}</h3>}
      renderOptionContent={({ option, submitted, isCorrect, isWrongSelected }) => <>{option} {submitted && isCorrect ? "✓" : ""}{submitted && isWrongSelected ? "✗" : ""}</>}
      renderQuestionFooter={({ question, submitted }) => submitted ? <p className="forced-quiz__explanation"><strong>Giải thích: </strong>{question.explanation}</p> : null}
    />
    {assessment.submitted ? <p className="forced-quiz__score">Kết quả: <strong>{score}/{forcedQuestions.length}</strong></p> : null}
    <div className="forced-actions"><Button type="button" onClick={onBack}>← Quay lại</Button>{assessment.submitted ? <Button type="button" className="forced-button--success" onClick={onContinue}>Viết Báo cáo →</Button> : <Button type="button" className="forced-button--primary" onClick={onSubmit}>Nộp bài</Button>}</div>
  </div></div>;
}
