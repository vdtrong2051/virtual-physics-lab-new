import React, { useState } from 'react';
import { InlineMath } from 'react-katex';

const QUESTIONS = [
  {
    q: "Hiện tượng cộng hưởng cơ xảy ra khi nào?",
    opts: [
      "A. Lực cản của môi trường rất nhỏ.",
      "B. Tần số của ngoại lực cưỡng bức bằng tần số riêng của hệ.",
      "C. Biên độ của ngoại lực cưỡng bức đạt giá trị cực đại.",
      "D. Hệ dao động không chịu tác dụng của lực ma sát."
    ],
    ans: 1, exp: "Điều kiện tiên quyết để xảy ra hiện tượng cộng hưởng (biên độ tăng vọt lên cực đại) là f = f0."
  },
  {
    q: "Biết công thức tính tần số riêng của con lắc đơn là f0 = (1/2π) * √(g/l). Để một con lắc đơn dài 1m bị cộng hưởng, ngoại lực cưỡng bức phải có chu kì T xấp xỉ bằng bao nhiêu? (Lấy g = π²)",
    opts: ["A. 1 giây", "B. 2 giây", "C. 3.14 giây", "D. 0.5 giây"],
    ans: 1, exp: "Để cộng hưởng thì T_ngoại = T_riêng = 2π√(l/g). Lấy g = π², ta có T = 2π√(1/π²) = 2 giây."
  }
];

export default function Practice({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-amber-700 mb-8 text-center">5. Bài tập Luyện tập</h2>
        
        <div className="space-y-8 mb-10">
          {QUESTIONS.map((item, qIdx) => (
            <div key={qIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold mb-4">Câu {qIdx + 1}: {item.q}</h3>
              <div className="space-y-3">
                {item.opts.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  const isCorrect = submitted && oIdx === item.ans;
                  const isWrong = submitted && isSelected && !isCorrect;
                  let bg = "bg-white border-slate-300 hover:border-amber-400";
                  if (submitted) {
                    if (isCorrect) bg = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
                    else if (isWrong) bg = "bg-rose-50 border-rose-500 text-rose-700 font-bold";
                  } else if (isSelected) bg = "bg-amber-50 border-amber-500 text-amber-700 font-bold";

                  return (
                    <button key={oIdx} disabled={submitted} onClick={() => setAnswers({...answers, [qIdx]: oIdx})} className={`w-full text-left px-5 py-3 rounded-xl border transition-colors ${bg}`}>
                      {opt} {submitted && isCorrect && '✓'} {submitted && isWrong && '✗'}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 p-4 bg-amber-50/50 rounded-xl border border-amber-200 text-sm text-amber-900">
                  <span className="font-bold">Giải thích: </span>{item.exp}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 font-bold">← Quay lại</button>
          {!submitted ? (
            <button onClick={() => setSubmitted(true)} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md">Nộp bài</button>
          ) : (
            <button onClick={onNext} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Viết Báo cáo ➔</button>
          )}
        </div>
      </div>
    </div>
  );
}