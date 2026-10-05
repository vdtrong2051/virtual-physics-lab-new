import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion } from 'framer-motion';

// ==========================================
// ANIMATION VARIANTS (Điều phối chuyển động)
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 250, damping: 25 } 
  }
};

export default function Intro({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#020617] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      
      {/* 1. CINEMATIC BACKGROUND EFFECTS */}
      {/* Lưới định vị tọa độ (Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-30 pointer-events-none"></div>
      
      {/* Ánh sáng khối (Glows - Tone Đỏ/Tím thể hiện sự tắt dần/nhiệt lượng) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      {/* 2. MAIN CONTENT CONTAINER */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl flex flex-col gap-8"
      >
        
        {/* HEADER */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Chuyên đề Dao động cơ
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Khảo sát Hiện tượng <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-fuchsia-600">
              Dao Động Tắt Dần
            </span>
          </h1>
        </motion.div>

        {/* KNOWLEDGE CARDS (Bố cục Lưới chuẩn Khoa học) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* Card 1: Khái niệm & Biểu hiện */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl hover:bg-slate-800/80 transition-colors group">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-center mb-6 text-rose-400 group-hover:scale-110 transition-transform">
              {/* Icon biểu đồ đi xuống */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Sự biến thiên Biên độ</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Trong thực tế, không có dao động nào duy trì mãi mãi. Khi kéo một con lắc ra khỏi vị trí cân bằng rồi thả tự do, ta sẽ quan sát thấy <strong>biên độ của nó giảm liên tục theo thời gian</strong>. Dao động như vậy gọi là dao động tắt dần.
            </p>
          </motion.div>

          {/* Card 2: Bản chất Năng lượng */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl hover:bg-slate-800/80 transition-colors group">
            <div className="w-12 h-12 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
              {/* Icon năng lượng tiêu hao */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Tiêu hao Cơ năng</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Nguyên nhân sinh ra hiện tượng tắt dần là do công âm của <strong>lực ma sát</strong> và <strong>lực cản môi trường</strong>. Phần cơ năng bị mất đi này không biến mất mà liên tục chuyển hóa thành nhiệt năng làm nóng môi trường.
            </p>
          </motion.div>

          {/* Card 3 (Nổi bật): Phương trình Toán học */}
          <motion.div variants={itemVariants} className="md:col-span-2 relative bg-gradient-to-r from-rose-900/30 to-fuchsia-900/10 backdrop-blur-xl border border-rose-500/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(225,29,72,0.1)] overflow-hidden">
            {/* Tia sáng quét (Shine effect) */}
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-rose-100/10 to-transparent skew-x-[-45deg] animate-[shine_5s_infinite]"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              
              {/* Bảng công thức */}
              <div className="w-full md:w-auto bg-[#020617]/80 border border-rose-500/30 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center shrink-0">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Phương trình li độ</span>
                <div className="text-rose-400 text-xl md:text-2xl font-medium">
                  <BlockMath math="x = A_0 \cdot e^{-\beta t} \cdot \cos(\omega t + \varphi)" />
                </div>
              </div>

              {/* Giải thích biến số */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-widest mb-4 border border-rose-500/20">
                  Phân tích hàm số
                </div>
                <ul className="space-y-3">
                  <li className="text-slate-300 text-sm md:text-base flex items-start gap-3">
                    <span className="text-rose-500 mt-1">⊛</span>
                    <span><InlineMath math="A_0" /> : Biên độ dao động ban đầu tại thời điểm <InlineMath math="t=0" />.</span>
                  </li>
                  <li className="text-slate-300 text-sm md:text-base flex items-start gap-3">
                    <span className="text-rose-500 mt-1">⊛</span>
                    <span><InlineMath math="e^{-\beta t}" /> : Nhân tử suy giảm hàm mũ (Hệ số <InlineMath math="\beta" /> càng lớn biểu thị lực cản càng mạnh, biên độ tắt càng nhanh).</span>
                  </li>
                  <li className="text-slate-300 text-sm md:text-base flex items-start gap-3">
                    <span className="text-rose-500 mt-1">⊛</span>
                    <span>Phương trình mô tả đường hình sin bị bóp nghẹt biên độ qua từng chu kì.</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

        </div>

        {/* BẮT ĐẦU THÍ NGHIỆM BUTTON */}
        <motion.div variants={itemVariants} className="flex justify-center mt-6">
          <button 
            onClick={onNext}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-slate-800 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 outline-none border border-slate-600 focus:ring-4 focus:ring-rose-500/30"
          >
            {/* Lớp nền gradient trượt lên khi hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-rose-500 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative flex items-center gap-3 text-lg tracking-wide">
              Chuẩn bị Thí nghiệm
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </button>
        </motion.div>

      </motion.div>
      
      {/* CSS Keyframes tùy chỉnh cho tia sáng */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
      `}} />
    </div>
  );
}