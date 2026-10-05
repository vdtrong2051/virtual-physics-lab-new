import React from 'react';

const EQUIPMENT = [
  { icon: '⚖️', name: 'Con lắc lò xo / Con lắc đơn', desc: 'Có gắn một quả nặng để thực hiện dao động.' },
  { icon: '🖋️', name: 'Bút dạ (Marker)', desc: 'Gắn chặt vào phần dưới của quả nặng để ghi lại quỹ đạo.' },
  { icon: '📜', name: 'Tấm nhựa / Băng giấy dài', desc: 'Nơi bút dạ tì lên để vẽ ra đồ thị li độ - thời gian.' },
  { icon: '⚙️', name: 'Bộ phận cuộn giấy', desc: 'Động cơ kéo tấm giấy chuyển động với vận tốc không đổi (v).' }
];

export default function Preparation({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">2. Dụng cụ Thực hành</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {EQUIPMENT.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-rose-700 mb-2">{item.name}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl mb-10">
          <h3 className="font-bold text-rose-800 mb-2">💡 Bố trí thí nghiệm:</h3>
          <p className="text-rose-900/80">Cho con lắc dao động ổn định. Bật động cơ kéo tấm giấy chạy ngang với tốc độ đều. Đầu bút dạ gắn trên quả nặng sẽ liên tục tiếp xúc và quét lên mặt giấy, để lại một vệt mực chính là đồ thị dao động tắt dần thực tế.</p>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 hover:bg-slate-200 font-bold rounded-xl transition-colors">← Quay lại</button>
          <button onClick={onNext} className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg transition-all">Vào Phòng Thí nghiệm ➔</button>
        </div>
      </div>
    </div>
  );
}