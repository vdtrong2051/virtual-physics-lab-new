import React from 'react';

const EQUIPMENT = [
  { icon: '⚙️', name: 'Mô-tơ điện quay chậm', desc: 'Tạo chuyển động tròn đều cho vật hình trụ.' },
  { icon: '📏', name: 'Thanh quay & Vật hình trụ', desc: 'Đóng vai trò là điểm M chuyển động trên quỹ đạo tròn.' },
  { icon: '💡', name: 'Đèn chiếu sáng (Nguồn sáng song song)', desc: 'Tạo bóng (hình chiếu Q) của vật hình trụ lên màn.' },
  { icon: '🌀', name: 'Con lắc lò xo', desc: 'Dao động điều hòa theo phương thẳng đứng.' },
  { icon: '📺', name: 'Màn chắn', desc: 'Dùng để hứng bóng của vật hình trụ và quả nặng con lắc.' }
];

export default function Preparation({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">2. Dụng cụ Thực hành</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {EQUIPMENT.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-indigo-700 mb-2">{item.name}</h3>
              <p className="text-slate-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl mb-10">
          <h3 className="font-bold text-indigo-800 mb-2">💡 Bố trí thí nghiệm:</h3>
          <p className="text-indigo-900/80">Đặt con lắc lò xo và hệ thống mô-tơ quay song song với màn chắn. Bật đèn chiếu sáng sao cho chùm tia sáng song song chiếu vuông góc vào màn, tạo ra bóng của cả vật hình trụ và quả nặng con lắc trên cùng một trục dọc.</p>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 hover:bg-slate-200 font-bold rounded-xl transition-colors">← Quay lại</button>
          <button onClick={onNext} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all">Vào Phòng Thí nghiệm ➔</button>
        </div>
      </div>
    </div>
  );
}