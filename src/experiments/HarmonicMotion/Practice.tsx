import { InlineMath } from 'react-katex';
import React, { useState } from 'react';

const QUESTIONS = [
  {
    q: "Biên độ của dao động điều hòa có độ lớn bằng đại lượng nào của chuyển động tròn đều tương ứng?",
    opts: ["A. Đường kính quỹ đạo", "B. Bán kính quỹ đạo", "C. Chu kì quay", "D. Tốc độ dài"],
    ans: 1, exp: "Hình chiếu của điểm M quét qua một đoạn thẳng có độ dài 2R. Dao động điều hòa quét qua đoạn thẳng dài 2A. Do đó Biên độ A = Bán kính R."
  },
  {
    q: "Khi vật chuyển động tròn đều đi qua vị trí xa nguồn sáng nhất hoặc gần nguồn sáng nhất (song song với trục chiếu), bóng của nó trên màn ảnh có vận tốc bằng bao nhiêu?",
    opts: ["A. Cực đại", "B. Bằng 0", "C. Bằng tốc độ dài của vật", "D. Không xác định được"],
    ans: 1, exp: "Vị trí này tương ứng với hình chiếu đang ở Biên. Tại Biên, vật dao động điều hòa đổi chiều chuyển động nên vận tốc tức thời bằng 0."
  }
];

export default function Practice({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-indigo-700 mb-8 text-center">5. Bài tập Luyện tập</h2>
        
        <div className="space-y-8 mb-10">
          {QUESTIONS.map((item, qIdx) => (
            <div key={qIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold mb-4">Câu {qIdx + 1}: {item.q}</h3>
              <div className="space-y-3">
                {item.opts.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  const isCorrect = submitted && oIdx === item.ans;
                  const isWrong = submitted && isSelected && !isCorrect;
                  let bg = "bg-white border-slate-300 hover:border-indigo-400";
                  if (submitted) {
                    if (isCorrect) bg = "bg-emerald-50 border-emerald-500 text-emerald-700 font-bold";
                    else if (isWrong) bg = "bg-rose-50 border-rose-500 text-rose-700 font-bold";
                  } else if (isSelected) bg = "bg-indigo-50 border-indigo-500 text-indigo-700 font-bold";

                  return (
                    <button key={oIdx} disabled={submitted} onClick={() => setAnswers({...answers, [qIdx]: oIdx})} className={`w-full text-left px-5 py-3 rounded-xl border transition-colors ${bg}`}>
                      {opt} {submitted && isCorrect && '✓'} {submitted && isWrong && '✗'}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-sm text-indigo-900">
                  <span className="font-bold">Giải thích: </span>{item.exp}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 font-bold">← Quay lại</button>
          {!submitted ? (
            <button onClick={() => setSubmitted(true)} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">Nộp bài</button>
          ) : (
            <button onClick={onNext} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Viết Báo cáo ➔</button>
          )}
        </div>
      </div>
    </div>
  );
}