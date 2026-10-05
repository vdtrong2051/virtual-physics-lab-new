import React from 'react';
import { InlineMath } from 'react-katex';

export default function Report({ onPrev }: { onPrev: () => void }) {
  const handlePrint = () => {
    setTimeout(() => window.print(), 150);
  };

  // Tinh chỉnh lại dòng kẻ chấm cho vừa khít chiều cao trang giấy
  const LinedSpace = ({ rows }: { rows: number }) => (
    <div className="space-y-[1.75rem] mt-5 mb-2 w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="w-full border-b-[1.5px] border-dotted border-slate-500"></div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-800 bg-slate-200 print-wrapper">
      
      {/* CSS KHÓA CHẶT 2 TRANG A4 TUYỆT ĐỐI */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 0; } /* Bỏ margin máy in để code tự kiểm soát */
          * { transform: none !important; transition: none !important; color: black !important; box-shadow: none !important; }
          html, body, #root, .print-wrapper, .print-scroll-area { height: auto !important; min-height: 0 !important; overflow: visible !important; display: block !important; position: static !important; background: white !important; }
          .no-print { display: none !important; }
          
          .a4-page { 
            width: 210mm !important; 
            height: 297mm !important; /* KHÓA CHỨNG CHIỀU CAO TRANG */
            margin: 0 !important; 
            border: none !important; 
            page-break-after: always !important; /* NGẮT ĐÚNG TRANG */
            page-break-inside: avoid !important;
            overflow: hidden !important; /* Dọn dẹp phần thừa */
          }
        }
      `}} />

      {/* THANH CÔNG CỤ (Ẩn khi in) */}
      <div className="no-print flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm mx-6 mt-6 border border-slate-300 shrink-0">
        <button onClick={onPrev} className="px-6 py-2.5 bg-slate-100 font-bold rounded-lg text-sm text-slate-600 hover:bg-slate-200 transition-colors">← Quay lại</button>
        <div className="font-black text-rose-700 uppercase tracking-widest flex flex-col items-center">
          <span>Phiếu Báo Cáo</span>
          <span className="text-[10px] text-slate-400 normal-case tracking-normal">Đã khóa cứng 2 trang A4</span>
        </div>
        <button onClick={handlePrint} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-sm shadow-md transition-all">🖨 In Báo Cáo</button>
      </div>

      {/* KHU VỰC HIỂN THỊ GIẤY */}
      <div className="flex-1 overflow-y-auto print-scroll-area pb-12 flex flex-col items-center gap-8 print:gap-0">
        
        {/* ========================================================= */}
        {/* TRANG A4 SỐ 1: THÔNG TIN & LÝ THUYẾT */}
        {/* ========================================================= */}
        <div className="a4-page bg-white w-[210mm] h-[297mm] p-[15mm] md:p-[20mm] shadow-lg border border-slate-300 leading-relaxed flex flex-col relative shrink-0 box-border">
          
          <h1 className="text-2xl font-bold uppercase mb-2 text-center">Báo Cáo Thực Hành Vật Lí 11</h1>
          <h2 className="text-lg font-bold uppercase mb-8 text-center text-slate-700">Nghiên Cứu Dao Động Tắt Dần</h2>

          <div className="mb-6 space-y-5">
            <div className="flex gap-4 items-end"><span className="font-bold whitespace-nowrap">Họ và tên:</span><div className="flex-1 border-b-[1.5px] border-dotted border-black"></div></div>
            <div className="flex gap-6 items-end">
              <div className="flex w-1/2 gap-4 items-end"><span className="font-bold">Lớp:</span><div className="flex-1 border-b-[1.5px] border-dotted border-black"></div></div>
              <div className="flex w-1/2 gap-4 items-end"><span className="font-bold">Nhóm:</span><div className="flex-1 border-b-[1.5px] border-dotted border-black"></div></div>
            </div>
          </div>

          <hr className="border-slate-800 mb-6 border-t-2" />

          <div className="space-y-6 text-justify flex-1">
            <section>
              <h3 className="font-bold text-lg mb-1">1. Mục đích thí nghiệm</h3>
              <p>Khảo sát ảnh hưởng của lực ma sát và lực cản môi trường lên biên độ và cơ năng của một hệ dao động cơ học thông qua việc vẽ đồ thị li độ - thời gian.</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-1">2. Kết quả quan sát vệt mực</h3>
              <p>Mô tả hình dạng của đồ thị do mũi bút dạ vẽ lại trên tấm giấy cuộn (nhận xét về khoảng cách giữa <InlineMath math="2" /> đỉnh liên tiếp và sự thay đổi độ cao của đỉnh sóng):</p>
              <LinedSpace rows={3} />
            </section>

            <section>
              <h3 className="font-bold text-lg mb-3">3. Phân tích nguyên lý Vật lý</h3>
              <div className="space-y-5 pl-2">
                <p>
                  - Trong quá trình dao động, cơ năng của hệ bị tiêu hao và chuyển hóa dần thành: <span className="inline-block w-[35%] border-b-[1.5px] border-dotted border-black translate-y-1"></span>
                </p>
                <p>
                  - Nguyên nhân trực tiếp gây ra sự tiêu hao này là do công của lực: <span className="inline-block w-[40%] border-b-[1.5px] border-dotted border-black translate-y-1"></span>
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-3 mt-4">4. Tìm hiểu thế giới tự nhiên dưới góc độ Vật lý</h3>
              <div className="space-y-4 pl-2">
                <div>
                  <p className="font-bold text-rose-900 mb-1">a. Ứng dụng có lợi (Hệ thống giảm xóc ô tô/xe máy)</p>
                  <p>Các kĩ sư chế tạo phuộc nhún chứa dầu nhớt bên trong xi-lanh để làm gì? Hiện tượng vật lý nào đã được áp dụng triệt để ở đây để xe không bị xóc nảy liên tục khi qua ổ gà?</p>
                  <LinedSpace rows={3} />
                </div>
                <div>
                  <p className="font-bold text-rose-900 mb-1">b. Ảnh hưởng có hại (Đồng hồ quả lắc)</p>
                  <p>Dao động tắt dần khiến quả lắc đồng hồ sẽ dừng lại sau một thời gian. Người thợ đồng hồ đã cung cấp năng lượng bù đắp lại phần cơ năng bị mất mát bằng cơ cấu nào?</p>
                  <LinedSpace rows={2} />
                </div>
              </div>
            </section>
          </div>
          
          <div className="absolute bottom-6 right-10 text-sm font-bold text-slate-400 no-print">Trang 1/2</div>
        </div>

        {/* ========================================================= */}
        {/* TRANG A4 SỐ 2: BÀI TOÁN & CHỮ KÝ */}
        {/* ========================================================= */}
        <div className="a4-page bg-white w-[210mm] h-[297mm] p-[15mm] md:p-[20mm] shadow-lg border border-slate-300 leading-relaxed flex flex-col relative shrink-0 box-border">
          
          <div className="flex-1 flex flex-col">
            <section>
              <h3 className="font-bold text-xl mb-4">5. Bài toán: Tính toán sự mất mát cơ năng</h3>
              <div className="pl-2 space-y-6">
                <p className="text-base md:text-lg bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  Một con lắc lò xo dao động tắt dần chậm. Khảo sát bằng cảm biến cho thấy: <strong className="text-rose-700">Sau mỗi một chu kì, biên độ của con lắc giảm <InlineMath math="5\%" /></strong> so với biên độ của chu kì ngay trước đó.
                </p>
                
                <div>
                  <p className="font-bold text-base md:text-lg">a. Sau <InlineMath math="2" /> chu kì, biên độ của con lắc (<InlineMath math="A_2" />) còn lại bao nhiêu phần trăm so với biên độ ban đầu (<InlineMath math="A_0" />)?</p>
                  <LinedSpace rows={6} />
                </div>

                <div className="mt-6">
                  <p className="font-bold text-base md:text-lg mb-1">
                    b. Tính phần trăm cơ năng của hệ đã bị mất đi sau <InlineMath math="2" /> chu kì dao động.
                  </p>
                  <p className="italic text-sm text-slate-600 mb-2 bg-rose-50/50 p-2 rounded border border-rose-100">
                    *Gợi ý: Biết cơ năng của dao động điều hòa tỉ lệ thuận với bình phương biên độ (<InlineMath math="W \sim A^2" />). 
                    Độ giảm phần trăm cơ năng được tính bằng công thức: 
                    <span className="inline-block ml-4 text-slate-800"><InlineMath math="\frac{\Delta W}{W_0} = \frac{W_0 - W_2}{W_0} \cdot 100\%" /></span>
                  </p>
                  <LinedSpace rows={8} />
                </div>
              </div>
            </section>

            {/* Chữ ký tự động đẩy xuống cuối trang */}
            <div className="mt-auto pt-8 flex justify-end">
              <div className="text-center w-72">
                <p className="italic mb-2 text-base md:text-lg">Ngày ....... tháng ....... năm 20.......</p>
                <p className="font-bold text-base md:text-lg">Người làm báo cáo</p>
                <p className="text-sm italic text-slate-500">(Ký và ghi rõ họ tên)</p>
                <div className="h-28"></div> {/* Khoảng trống để ký tên */}
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-10 text-sm font-bold text-slate-400 no-print">Trang 2/2</div>
        </div>

      </div>
    </div>
  );
}