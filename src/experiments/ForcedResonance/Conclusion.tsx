import React from 'react';
import { InlineMath } from 'react-katex';

export default function Conclusion({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-amber-700 mb-6 text-center">4. Kết luận</h2>
        
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed bg-amber-50/50 p-6 rounded-2xl border border-amber-200">
          <p>
            Qua quan sát thí nghiệm, ta rút ra được các kết luận quan trọng sau đây khi trả lời câu hỏi trong sách giáo khoa:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-base">
            <li>
              <strong className="text-amber-700">Các con lắc khác có dao động không?</strong> Có. Thông qua thanh ngang, con lắc điều khiển Đ đã truyền một lực cưỡng bức tuần hoàn khiến các con lắc 1, 2, 3 đều bị ép dao động theo.
            </li>
            <li>
              <strong className="text-amber-700">Con lắc nào dao động mạnh nhất?</strong> Con lắc có chiều dài bằng đúng chiều dài của con lắc điều khiển Đ sẽ dao động với biên độ lớn nhất (mạnh nhất).
            </li>
            <li>
              <strong className="text-amber-700">Tại sao?</strong> Vì chu kì dao động của con lắc đơn tỉ lệ thuận với căn bậc hai chiều dài (<InlineMath math="T = 2\pi\sqrt{l/g}" />). Khi <InlineMath math="l = l_D" /> thì tần số riêng của con lắc bằng đúng tần số của ngoại lực cưỡng bức. Lúc này xảy ra hiện tượng <strong className="text-rose-600 uppercase">Cộng hưởng</strong>.
            </li>
          </ul>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 hover:bg-slate-100 font-bold rounded-xl transition-colors">← Thực hành lại</button>
          <button onClick={onNext} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all">Làm bài Tập ➔</button>
        </div>
      </div>
    </div>
  );
}