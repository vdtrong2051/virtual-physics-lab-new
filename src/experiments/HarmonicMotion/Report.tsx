import React from 'react';
import { InlineMath } from 'react-katex';

export default function Report({ onPrev }: { onPrev: () => void }) {
  const handlePrint = () => {
    setTimeout(() => window.print(), 150);
  };

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-800 bg-slate-100 print-wrapper">
      
      {/* 🚀 BỘ CSS PRINT TỐI THƯỢNG (Khử mọi style thừa) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          
          * { 
            transform: none !important; 
            transition: none !important; 
            color: black !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Mở khóa toàn bộ không gian để in tràn trang */
          html, body, #root, .print-wrapper, .print-scroll-area { 
            height: auto !important; 
            min-height: 0 !important;
            overflow: visible !important; 
            display: block !important; 
            position: static !important; 
            background: white !important; 
          }
          
          /* Ẩn các nút bấm */
          .no-print { display: none !important; }
          
          /* Căn lề giấy */
          #printable-report { 
            position: relative !important; 
            width: 100% !important; 
            max-width: none !important;
            margin: 0 !important; 
            padding: 0 !important; 
            border: none !important; 
          }

          /* Chống cắt trang giữa chừng */
          .break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}} />

      {/* THANH CÔNG CỤ (Sẽ bị ẩn khi in) */}
      <div className="no-print flex justify-between items-center mb-4 bg-white p-4 rounded-xl shadow-sm mx-6 mt-6 border border-slate-200 shrink-0">
        <button onClick={onPrev} className="px-6 py-2.5 bg-slate-100 font-bold rounded-lg text-sm text-slate-600 hover:bg-slate-200 transition-colors">← Quay lại</button>
        <div className="font-black text-indigo-700 uppercase tracking-widest">Phiếu Báo Cáo</div>
        <button onClick={handlePrint} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm shadow-md transition-all">🖨 In Báo Cáo</button>
      </div>

      {/* KHU VỰC GIẤY A4 */}
      <div className="flex-1 overflow-y-auto print-scroll-area pb-10">
        <div id="printable-report" className="mx-auto bg-white w-full max-w-[210mm] min-h-[297mm] p-12 shadow-lg text-base border border-slate-300">
          
          <h1 className="text-2xl font-bold uppercase mb-2 text-center">Báo Cáo Thực Hành Vật Lí 11</h1>
          <h2 className="text-lg font-bold uppercase mb-8 text-center">Mối liên hệ giữa DĐĐH và Chuyển động tròn đều</h2>

          <div className="mb-6 space-y-4">
            <div className="flex gap-4 items-end"><span className="font-bold whitespace-nowrap">Họ và tên:</span><div className="flex-1 border-b-2 border-dotted border-black"></div></div>
            <div className="flex gap-6 items-end">
              <div className="flex w-1/2 gap-4 items-end"><span className="font-bold">Lớp:</span><div className="flex-1 border-b-2 border-dotted border-black"></div></div>
              <div className="flex w-1/2 gap-4 items-end"><span className="font-bold">Nhóm:</span><div className="flex-1 border-b-2 border-dotted border-black"></div></div>
            </div>
          </div>

          <hr className="border-black mb-6 border-t-2" />

          <div className="space-y-6 text-justify">
            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-2">1. Mục đích thí nghiệm</h3>
              <p className="leading-relaxed">Trực quan hóa và kiểm chứng bằng thực nghiệm: Hình chiếu của một vật chuyển động tròn đều xuống một trục tọa độ nằm trong mặt phẳng quỹ đạo là một dao động điều hòa.</p>
            </section>

            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-2">2. Kết quả quan sát</h3>
              <p className="mb-3">Mô tả sự đồng bộ giữa bóng của vật hình trụ và bóng của con lắc lò xo khi mô-tơ hoạt động:</p>
              <div className="w-full h-24 border-2 border-slate-400 p-4 italic text-gray-400 bg-gray-50 flex items-center justify-center">
                (Học sinh ghi chép kết quả quan sát thực tế vào khu vực này)
              </div>
            </section>

            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-4">3. Xử lý số liệu & Lập phương trình dao động</h3>
              <p className="mb-4 leading-relaxed">
                Dựa vào các thông số em đã tự tay thiết lập trên bảng điều khiển mô-tơ, hãy chuyển đổi chúng thành các đại lượng tương ứng của dao động điều hòa (DĐĐH) cho hình chiếu trên màn.
              </p>
              
              <div className="space-y-6 pl-2">
                <div className="space-y-2">
                  <p className="font-bold text-indigo-900">a. Sự tương đương về Không gian (Biên độ)</p>
                  <p className="flex items-center gap-2">
                    - Bán kính quỹ đạo tròn của mô-tơ là: <InlineMath math="R = \dots\dots\dots\dots\dots" /> (m)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-xl">👉</span> Suy ra Biên độ DĐĐH của hình chiếu là: <InlineMath math="A = \dots\dots\dots\dots\dots" /> (m)
                  </p>
                </div>

                <div className="space-y-2 break-inside-avoid">
                  <p className="font-bold text-indigo-900">b. Sự tương đương về Thời gian (Chu kì, Tần số)</p>
                  <p className="flex items-center gap-2">
                    - Tốc độ góc (vận tốc góc) cài đặt cho mô-tơ: <InlineMath math="\omega = \dots\dots\dots\dots\dots" /> (rad/s)
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-xl">👉</span> Tần số góc của DĐĐH tương ứng: <InlineMath math="\omega = \dots\dots\dots\dots\dots" /> (rad/s)
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <span className="text-xl">👉</span> Tính chu kì dao động của con lắc lò xo: 
                    <span className="ml-3"><InlineMath math="T = \frac{2\pi}{\omega} = \dots\dots\dots\dots\dots\dots" /> (s)</span>
                  </p>
                </div>

                <div className="space-y-3 break-inside-avoid">
                  <p className="font-bold text-indigo-900">c. Xác định Pha ban đầu & Viết phương trình</p>
                  <p>
                    Giả sử tại thời điểm bắt đầu bấm đồng hồ (<InlineMath math="t = 0" />), vật hình trụ nằm ở vị trí <strong>cao nhất</strong> (tương ứng với biên dương của hệ trục).
                  </p>
                  <p className="flex items-center gap-2">
                    - Pha ban đầu của hình chiếu: <InlineMath math="\varphi = \dots\dots\dots\dots" /> (rad)
                  </p>
                  <p className="mt-2">- Phương trình dao động điều hòa hoàn chỉnh của hình chiếu là:</p>
                  
                  <div className="w-full h-16 border-2 border-dashed border-indigo-300 mt-2 flex items-center justify-center bg-indigo-50/50 italic text-indigo-300 text-lg">
                    <InlineMath math="x = A \cos(\omega t + \varphi)" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-16 flex justify-end break-inside-avoid">
            <div className="text-center w-64">
              <p className="italic mb-2">Ngày ....... tháng ....... năm .......</p>
              <p className="font-bold">Người làm báo cáo</p>
              <p className="text-sm italic">(Ký và ghi rõ họ tên)</p>
              <div className="h-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}