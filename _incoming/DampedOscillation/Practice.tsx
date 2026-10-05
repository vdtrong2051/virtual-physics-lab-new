import React, { useState } from 'react';
import { InlineMath } from 'react-katex';

const QUESTIONS = [
  {
    q: "Nguyên nhân chủ yếu làm cho dao động của con lắc trong thí nghiệm bị tắt dần là gì?",
    opts: ["A. Do lực cản của môi trường và lực ma sát.", "B. Do trọng lực tác dụng lên vật.", "C. Do lực căng của sợi dây đứt dần.", "D. Do động năng chuyển hóa thành thế năng."],
    ans: 0, exp: "Lực ma sát ở điểm treo và ma sát giữa bút dạ với giấy, cùng lực cản không khí thực hiện công âm làm cơ năng giảm dần."
  },
  {
    q: "Trong quá trình dao động tắt dần, đại lượng nào sau đây giảm liên tục theo thời gian?",
    opts: ["A. Chu kì dao động.", "B. Tần số dao động.", "C. Biên độ và Cơ năng.", "D. Động năng và Thế năng."],
    ans: 2, exp: "Biên độ giảm dần do cơ năng tiêu hao (chuyển hóa thành nhiệt năng). Động năng và thế năng thì tăng giảm tuần hoàn chứ không giảm liên tục."
  }
];

export default function Practice({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-rose-700 mb-8 text-center">5. Bài tập Luyện tập</h2>
        
        <div className="space-y-8 mb-10">
          {QUESTIONS.map((item, qIdx) => (
            <div key={qIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold mb-4">Câu {qIdx + 1}: {item.q}</h3>
              <div className="space-y-3">
                {item.opts.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  const isCorrect = submitted && oIdx === item.ans;
                  const isWrong = submitted && isSelected && !isCorrect;
                  let bg = "bg-white border-slate-300 hover:border-rose-400";
                  if (submitted) {
                    if (isCorrect) bg = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
                    else if (isWrong) bg = "bg-rose-50 border-rose-500 text-rose-700 font-bold";
                  } else if (isSelected) bg = "bg-rose-50 border-rose-500 text-rose-700 font-bold";

                  return (
                    <button key={oIdx} disabled={submitted} onClick={() => setAnswers({...answers, [qIdx]: oIdx})} className={`w-full text-left px-5 py-3 rounded-xl border transition-colors ${bg}`}>
                      {opt} {submitted && isCorrect && '✓'} {submitted && isWrong && '✗'}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 p-4 bg-rose-50/50 rounded-xl border border-rose-100 text-sm text-rose-900">
                  <span className="font-bold">Giải thích: </span>{item.exp}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 font-bold">← Quay lại</button>
          {!submitted ? (
            <button onClick={() => setSubmitted(true)} className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md">Nộp bài</button>
          ) : (
            <button onClick={onNext} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Viết Báo cáo ➔</button>
          )}
        </div>
      </div>
    </div>
  );
}