import React from 'react';

const EQUIPMENT = [
  { icon: '🏗️', name: 'Giá đỡ & Thanh ngang', desc: 'Thanh cứng hình trụ có thể xoay nhẹ quanh trục để truyền năng lượng giữa các con lắc.' },
  { icon: '🔴', name: 'Con lắc điều khiển (Đ)', desc: 'Con lắc có khối lượng lớn nhất, đóng vai trò tạo ra ngoại lực tuần hoàn.' },
  { icon: '🔵', name: 'Các con lắc thử (1, 2, 3)', desc: 'Các con lắc có khối lượng nhỏ hơn và chiều dài khác nhau, đóng vai trò hệ chịu lực cưỡng bức.' }
];

export default function Preparation({ onNext, onPrev }: { onNext: () => void, onPrev: () => void }) {
  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-slate-800 mb-8 text-center">2. Dụng cụ Thực hành</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {EQUIPMENT.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-amber-700 mb-2">{item.name}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl mb-10 shadow-inner">
          <h3 className="font-bold text-amber-800 mb-2">💡 Cách tiến hành (Dự đoán):</h3>
          <p className="text-amber-900/80 leading-relaxed">
            Kéo con lắc điều khiển Đ sang một bên rồi thả ra. Thông qua thanh ngang, con lắc Đ sẽ "ép" các con lắc 1, 2, 3 dao động theo. Hãy tự hỏi: Liệu tất cả có dao động không? Con lắc nào sẽ vung cao nhất?
          </p>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={onPrev} className="px-6 py-3 text-slate-500 hover:bg-slate-200 font-bold rounded-xl transition-colors">← Quay lại</button>
          <button onClick={onNext} className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition-all">Vào Phòng Thí nghiệm ➔</button>
        </div>
      </div>
    </div>
  );
}