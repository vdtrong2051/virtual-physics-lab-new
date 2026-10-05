import React from 'react';
import { InlineMath } from 'react-katex';

export default function Conclusion({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-slate-200">
        <h2 className="text-3xl font-black text-rose-700 mb-6 text-center">4. Kết luận</h2>
        
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
          <p>
            Thông qua vết mực được vẽ lại trên mặt giấy cuộn, ta có thể rút ra 3 kết luận cốt lõi về **Dao động tắt dần**:
          </p>
          <ul className="list-disc pl-6 space-y-4 text-base">
            <li><strong className="text-rose-700">Biên độ giảm dần:</strong> Lực cản của môi trường (không khí) và ma sát tại điểm treo, mũi bút đã sinh công âm, triệt tiêu dần năng lượng của hệ.</li>
            <li><strong className="text-rose-700">Chuyển hóa năng lượng:</strong> Cơ năng của hệ không biến mất mà <InlineMath math="W" /> chuyển hóa dần thành nhiệt năng làm nóng môi trường xung quanh.</li>
            <li><strong className="text-rose-700">Tính đẳng thời (Gần đúng):</strong> Nếu lực cản nhỏ, chu kì dao động <InlineMath math="T" /> hầu như không đổi (khoảng cách giữa 2 đỉnh sóng mực liên tiếp trên giấy là bằng nhau).</li>
          </ul>
        </div>

        <div className="mt-10 flex justify-between items-center">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 hover:bg-slate-100 font-bold rounded-xl transition-colors">← Xem lại hình ảnh</button>
          <button onClick={onNext} className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg transition-all">Làm bài Luyện tập ➔</button>
        </div>
      </div>
    </div>
  );
}