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
      
      {/* Ánh sáng khối (Glows) */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      {/* Hiệu ứng sóng cộng hưởng tỏa ra liên tục */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none flex items-center justify-center opacity-20">
        <div className="absolute w-[300px] h-[300px] border border-amber-500/30 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-[500px] h-[500px] border border-amber-500/20 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
        <div className="absolute w-[700px] h-[700px] border border-amber-500/10 rounded-full animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite_2s]"></div>
      </div>

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
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Chuyên đề Dao động cơ
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Dao Động Cưỡng Bức & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">
              Hiện Tượng Cộng Hưởng
            </span>
          </h1>
        </motion.div>

        {/* KNOWLEDGE CARDS (Bố cục Lưới chuẩn Khoa học) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          
          {/* Card 1: Khái niệm */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl hover:bg-slate-800/80 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Ngoại lực tuần hoàn</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Khi một hệ dao động chịu tác dụng của một ngoại lực biến thiên tuần hoàn theo thời gian, hệ sẽ bị "ép" phải dao động theo. Quá trình này được định nghĩa là <strong>Dao động cưỡng bức</strong>.
            </p>
          </motion.div>

          {/* Card 2: Đặc điểm Biên độ */}
          <motion.div variants={itemVariants} className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl hover:bg-slate-800/80 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Đặc điểm Biên độ</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Biên độ của dao động cưỡng bức không đổi và phụ thuộc vào độ chênh lệch giữa <strong>tần số ngoại lực</strong> (<InlineMath math="f" />) và <strong>tần số riêng của hệ</strong> (<InlineMath math="f_0" />). Độ lệch càng nhỏ, biên độ càng lớn.
            </p>
          </motion.div>

          {/* Card 3 (Nổi bật): Cộng hưởng */}
          <motion.div variants={itemVariants} className="md:col-span-2 relative bg-gradient-to-r from-amber-900/40 to-orange-900/20 backdrop-blur-xl border border-amber-500/30 p-8 rounded-3xl shadow-[0_0_40px_rgba(217,119,6,0.1)] overflow-hidden">
            {/* Tia sáng quét (Shine effect) */}
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-amber-100/10 to-transparent skew-x-[-45deg] animate-[shine_4s_infinite]"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest mb-4 border border-amber-500/20">
                  Trạng thái cực đại
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Hiện tượng Cộng hưởng</h3>
                <p className="text-amber-100/80 leading-relaxed text-base md:text-lg">
                  Là hiện tượng biên độ dao động cưỡng bức tăng vọt và đạt giá trị cực đại khi tần số của ngoại lực cưỡng bức tiến đến bằng với tần số riêng của hệ dao động.
                </p>
              </div>

              {/* Bảng công thức */}
              <div className="w-full md:w-auto bg-[#020617]/80 border border-amber-500/40 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center shrink-0">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Điều kiện Toán học</span>
                <div className="text-amber-400 text-xl md:text-2xl">
                  <BlockMath math="f = f_0 \;\; \Rightarrow \;\; A = A_{\text{max}}" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* BẮT ĐẦU THÍ NGHIỆM BUTTON */}
        <motion.div variants={itemVariants} className="flex justify-center mt-6">
          <button 
            onClick={onNext}
            className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white bg-slate-800 rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 outline-none border border-slate-600 focus:ring-4 focus:ring-amber-500/30"
          >
            {/* Lớp nền gradient trượt lên khi hover */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
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