import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

export default function Report({ onPrev }: { onPrev: () => void }) {
  const handlePrint = () => {
    setTimeout(() => window.print(), 150);
  };

  // Tinh chỉnh lại dòng kẻ chấm
  const LinedSpace = ({ rows }: { rows: number }) => (
    <div className="space-y-[1.75rem] mt-5 mb-2 w-full">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="w-full border-b-[1.5px] border-dotted border-slate-500"></div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col font-sans text-slate-800 bg-slate-200 print-wrapper">
      
      {/* CSS IN ẤN TỰ NHIÊN (Không ép cứng chiều cao nữa) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 15mm; } /* Trả lại margin cho máy in tự tính toán */
          * { transform: none !important; transition: none !important; color: black !important; box-shadow: none !important; }
          html, body, #root, .print-wrapper, .print-scroll-area { height: auto !important; min-height: 0 !important; overflow: visible !important; display: block !important; position: static !important; background: white !important; }
          .no-print { display: none !important; }
          
          #printable-report { 
            width: 100% !important; 
            max-width: none !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            border: none !important; 
          }
          
          /* Giúp máy in không cắt ngang giữa các câu hỏi */
          .break-inside-avoid { 
            page-break-inside: avoid; 
            break-inside: avoid; 
          }
        }
      `}} />

      {/* THANH CÔNG CỤ (Ẩn khi in) */}
      <div className="no-print flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm mx-6 mt-6 border border-slate-300 shrink-0">
        <button onClick={onPrev} className="px-6 py-2.5 bg-slate-100 font-bold rounded-lg text-sm text-slate-600 hover:bg-slate-200 transition-colors">← Quay lại</button>
        <div className="font-black text-rose-700 uppercase tracking-widest flex flex-col items-center">
          <span>Phiếu Báo Cáo</span>
          <span className="text-[10px] text-slate-400 normal-case tracking-normal">In ấn tự nhiên (Không giới hạn trang)</span>
        </div>
        <button onClick={handlePrint} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-sm shadow-md transition-all">🖨 In Báo Cáo</button>
      </div>

      {/* KHU VỰC HIỂN THỊ GIẤY */}
      <div className="flex-1 overflow-y-auto print-scroll-area pb-12 flex justify-center">
        
        {/* TỜ GIẤY DUY NHẤT SẼ TỰ ĐỘNG DÀI RA THEO NỘI DUNG */}
        <div id="printable-report" className="bg-white w-full max-w-[210mm] min-h-[297mm] p-10 md:p-14 shadow-lg border border-slate-300 leading-relaxed flex flex-col box-border">
          
          <h1 className="text-2xl font-bold uppercase mb-2 text-center">Báo Cáo Thực Hành Vật Lí 11</h1>
          <h2 className="text-lg font-bold uppercase mb-8 text-center text-slate-700">Nghiên Cứu Dao Động Tắt Dần</h2>

          {/* Header Thông tin */}
          <div className="mb-6 space-y-5 break-inside-avoid">
            <div className="flex gap-4 items-end"><span className="font-bold whitespace-nowrap">Họ và tên:</span><div className="flex-1 border-b-[1.5px] border-dotted border-black"></div></div>
            <div className="flex gap-6 items-end">
              <div className="flex w-1/2 gap-4 items-end"><span className="font-bold">Lớp:</span><div className="flex-1 border-b-[1.5px] border-dotted border-black"></div></div>
              <div className="flex w-1/2 gap-4 items-end"><span className="font-bold">Nhóm:</span><div className="flex-1 border-b-[1.5px] border-dotted border-black"></div></div>
            </div>
          </div>

          <hr className="border-slate-800 mb-8 border-t-2" />

          {/* Nội dung báo cáo */}
          <div className="space-y-10 text-justify flex-1">
            
            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-2">1. Mục đích thí nghiệm</h3>
              <p>Khảo sát ảnh hưởng của lực ma sát và lực cản môi trường lên biên độ và cơ năng của một hệ dao động cơ học thông qua việc vẽ và phân tích đồ thị li độ - thời gian.</p>
            </section>

            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-3">2. Kết quả quan sát và Vẽ đồ thị</h3>
              <div className="space-y-6 pl-2">
                <div>
                  <p className="font-bold mb-1">a. Kết quả vệt mực:</p>
                  <p>Mô tả hình dạng của đồ thị do mũi bút dạ vẽ lại trên tấm giấy cuộn (nhận xét về khoảng cách giữa <InlineMath math="2" /> đỉnh liên tiếp và sự thay đổi độ cao của đỉnh sóng):</p>
                  <LinedSpace rows={3} />
                </div>
                
                <div className="mt-4">
                  <p className="font-bold mb-3">b. Phác họa đồ thị dao động (<InlineMath math="x-t" />) của con lắc trong <InlineMath math="2" /> môi trường:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Đồ thị 1 */}
                    <div className="flex-1 border-[1.5px] border-slate-400 p-3 h-48 relative flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
                      <span className="absolute top-2 left-3 text-xs font-bold text-slate-500 uppercase bg-white/80 px-1 z-10">Không khí (Lực cản nhỏ)</span>
                      <span className="text-slate-300 italic text-sm absolute z-10">Học sinh vẽ đồ thị vào đây...</span>
                      <div className="absolute left-6 top-8 bottom-4 w-[1.5px] bg-slate-300"></div> 
                      <div className="absolute left-6 right-4 top-1/2 h-[1.5px] bg-slate-300"></div> 
                      <div className="absolute left-2 top-8 text-[10px] text-slate-400 font-bold"><InlineMath math="x" /></div>
                      <div className="absolute right-4 top-[55%] text-[10px] text-slate-400 font-bold"><InlineMath math="t" /></div>
                    </div>

                    {/* Đồ thị 2 */}
                    <div className="flex-1 border-[1.5px] border-slate-400 p-3 h-48 relative flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden">
                      <span className="absolute top-2 left-3 text-xs font-bold text-slate-500 uppercase bg-white/80 px-1 z-10">Nước (Lực cản lớn)</span>
                      <span className="text-slate-300 italic text-sm absolute z-10">Học sinh vẽ đồ thị vào đây...</span>
                      <div className="absolute left-6 top-8 bottom-4 w-[1.5px] bg-slate-300"></div> 
                      <div className="absolute left-6 right-4 top-1/2 h-[1.5px] bg-slate-300"></div> 
                      <div className="absolute left-2 top-8 text-[10px] text-slate-400 font-bold"><InlineMath math="x" /></div>
                      <div className="absolute right-4 top-[55%] text-[10px] text-slate-400 font-bold"><InlineMath math="t" /></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-bold mb-1">c. Nhận xét:</p>
                  <p>So sánh tốc độ giảm biên độ và số chu kì thực hiện được của con lắc trong <InlineMath math="2" /> môi trường trên:</p>
                  <LinedSpace rows={3} />
                </div>
              </div>
            </section>

            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-2">3. Phân tích nguyên lý Vật lý</h3>
              <div className="space-y-4 pl-2">
                <p>
                  - Cơ năng của hệ bị tiêu hao và chuyển hóa dần thành: <span className="inline-block w-[40%] border-b-[1.5px] border-dotted border-black translate-y-1"></span>
                </p>
                <p>
                  - Nguyên nhân là do công của lực: <span className="inline-block w-[50%] border-b-[1.5px] border-dotted border-black translate-y-1"></span>
                </p>
              </div>
            </section>

            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-4">4. Tìm hiểu thế giới tự nhiên dưới góc độ Vật lý</h3>
              <div className="space-y-5 pl-2">
                <div>
                  <p className="font-bold text-rose-900 mb-1">a. Ứng dụng có lợi (Hệ thống giảm xóc ô tô/xe máy)</p>
                  <p>Các kĩ sư chế tạo phuộc nhún chứa dầu nhớt bên trong xi-lanh để làm gì? Hiện tượng vật lý nào đã được áp dụng triệt để ở đây để xe không bị xóc nảy liên tục khi qua ổ gà?</p>
                  <LinedSpace rows={4} />
                </div>
                <div className="mt-4">
                  <p className="font-bold text-rose-900 mb-1">b. Ảnh hưởng có hại (Đồng hồ quả lắc)</p>
                  <p>Dao động tắt dần khiến quả lắc đồng hồ sẽ dừng lại sau một thời gian. Người thợ đồng hồ đã cung cấp năng lượng bù đắp lại phần cơ năng bị mất mát bằng cơ cấu nào?</p>
                  <LinedSpace rows={4} />
                </div>
              </div>
            </section>

            <section className="break-inside-avoid">
              <h3 className="font-bold text-lg mb-4">5. Bài toán: Tính toán sự mất mát cơ năng</h3>
              <div className="pl-2 space-y-6">
                <p className="text-base bg-slate-50 p-4 border border-slate-200 rounded-lg">
                  Một con lắc lò xo dao động tắt dần chậm. Khảo sát bằng cảm biến cho thấy: <strong className="text-rose-700">Sau mỗi một chu kì, biên độ của con lắc giảm <InlineMath math="5\%" /></strong> so với biên độ của chu kì ngay trước đó.
                </p>
                
                <div>
                  <p className="font-bold mb-2">a. Sau <InlineMath math="2" /> chu kì, biên độ của con lắc (<InlineMath math="A_2" />) còn lại bao nhiêu phần trăm so với biên độ ban đầu (<InlineMath math="A_0" />)?</p>
                  <LinedSpace rows={5} />
                </div>

                <div className="mt-6 break-inside-avoid">
                  <p className="font-bold mb-1">
                    b. Tính phần trăm cơ năng của hệ đã bị mất đi sau <InlineMath math="2" /> chu kì dao động.
                  </p>
                  <p className="italic text-sm text-slate-600 mb-2 bg-rose-50/50 p-3 rounded border border-rose-100">
                    *Gợi ý: Biết cơ năng của dao động điều hòa tỉ lệ thuận với bình phương biên độ (<InlineMath math="W \sim A^2" />). 
                    Độ giảm phần trăm cơ năng được tính bằng công thức: 
                    <span className="inline-block ml-4 text-slate-800"><InlineMath math="\frac{\Delta W}{W_0} = \frac{W_0 - W_2}{W_0} \cdot 100\%" /></span>
                  </p>
                  <LinedSpace rows={6} />
                </div>
              </div>
            </section>

          </div>

          {/* Chữ ký */}
          <div className="mt-12 pt-8 flex justify-end break-inside-avoid">
            <div className="text-center w-72">
              <p className="italic mb-2">Ngày ....... tháng ....... năm 20.......</p>
              <p className="font-bold text-lg">Người làm báo cáo</p>
              <p className="text-sm italic text-slate-500">(Ký và ghi rõ họ tên)</p>
              <div className="h-32"></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}