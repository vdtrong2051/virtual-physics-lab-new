import React from 'react';
import { InlineMath } from 'react-katex';

export default function Conclusion({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-indigo-700 mb-6 text-center">4. Kết luận</h2>
        
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
          <p>
            Qua quan sát thí nghiệm, ta thấy khi vật hình trụ quay tròn đều, bóng của nó trên màn ảnh luôn <span className="font-bold text-rose-600">chuyển động trùng khớp</span> với bóng của quả nặng con lắc lò xo đang dao động thẳng đứng.
          </p>
          <div className="h-px bg-indigo-200 w-full"></div>
          <p className="font-bold text-xl text-center text-indigo-900">
            "Dao động điều hòa có thể được coi là hình chiếu của một chuyển động tròn đều xuống một đường thẳng nằm trong mặt phẳng quỹ đạo."
          </p>
          <ul className="list-disc pl-6 space-y-3 text-base">
            <li>Bán kính quỹ đạo tròn <InlineMath math="R" /> chính là biên độ dao động <InlineMath math="A" />.</li>
            <li>Tốc độ góc <InlineMath math="\omega" /> của chuyển động tròn chính là tần số góc <InlineMath math="\omega" /> của dao động điều hòa.</li>
            <li>Vị trí góc ban đầu trên đường tròn chính là pha ban đầu <InlineMath math="\varphi" />.</li>
          </ul>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 hover:bg-slate-100 font-bold rounded-xl transition-colors">← Thực hành lại</button>
          <button onClick={onNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">Làm bài Tập ➔</button>
        </div>
      </div>
    </div>
  );
}