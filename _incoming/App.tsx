import { InlineMath } from 'react-katex';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT CÁC MODULE THÍ NGHIỆM ĐÃ HOÀN THIỆN ---
// VẬT LÝ 12
import BrownianMotion from './experiments/BrownianMotion';
import InternalEnergy from './experiments/InternalEnergy/index'; 
import JouleExperiment from './experiments/JouleExperiment/index';
import SpecificHeatExperiment from './experiments/SpecificHeat/index'; 
import LatentHeatExperiment from './experiments/LatentHeatExperiment/index';
import VaporizationExperiment from './experiments/VaporizationExperiment/index'; 
import BoyleExperiment from './experiments/BoylesLaw/index';
import CharlesExperiment from './experiments/CharlesLaw/index';

// VẬT LÝ 11
import HarmonicMotion from './experiments/HarmonicMotion/index';
import DampedOscillation from './experiments/DampedOscillation/index';
import ForcedResonance from './experiments/ForcedResonance/index'; // ĐÃ THÊM IMPORT

// ==========================================
// HỆ THỐNG ÂM THANH UI (Bảo vệ Next.js SSR)
// ==========================================
let localAudioCtx: AudioContext | null = null;
const playAudio = (type: 'open' | 'click' | 'locked') => {
  if (typeof window === 'undefined') return;
  try {
    if (!localAudioCtx) localAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (localAudioCtx.state === 'suspended') localAudioCtx.resume();
    const osc = localAudioCtx.createOscillator();
    const gain = localAudioCtx.createGain();
    const now = localAudioCtx.currentTime;
    osc.connect(gain); gain.connect(localAudioCtx.destination);

    if (type === 'open') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'locked') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'click') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);
    }
  } catch (e) {}
};

// ==========================================
// CƠ SỞ DỮ LIỆU: CẤU TRÚC THƯ MỤC CẤP BẬC
// ==========================================
const FOLDERS = [
  {
    id: 'grade-12',
    title: 'Vật Lý 12',
    icon: '🎓',
    isReady: true,
    topics: [
      {
        id: 'nhiet_hoc',
        title: 'Chuyên đề: Nhiệt Học',
        icon: '🍑',
        headerColor: 'text-rose-600',
        borderColor: 'border-rose-200/80',
        experiments: [
          {
            id: 'brownian', title: '1. Chuyển động Brown', icon: '🔬', tag: 'Quan sát Vi mô',
            desc: 'Quan sát sự chuyển động hỗn loạn của hạt phấn hoa trong môi trường nước bằng kính hiển vi.',
            classes: { hoverBorder: 'hover:border-rose-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(251,113,133,0.15)]', blob: 'bg-rose-200/40', iconBg: 'bg-rose-100 text-rose-500', tagBg: 'text-rose-600 bg-rose-50', btnBg: 'text-rose-600 bg-rose-100/80 hover:bg-rose-200' }
          },
          {
            id: 'internal_energy', title: '2. Sự biến đổi Nội năng', icon: '🔥', tag: 'Mô phỏng Trực quan',
            desc: 'Thực hành đun nóng ống nghiệm kín để quan sát sự chuyển hóa từ Nhiệt năng thành Động năng phân tử.',
            classes: { hoverBorder: 'hover:border-orange-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(251,146,60,0.15)]', blob: 'bg-orange-200/40', iconBg: 'bg-orange-100 text-orange-500', tagBg: 'text-orange-600 bg-orange-50', btnBg: 'text-orange-600 bg-orange-100/80 hover:bg-orange-200' }
          },
          {
            id: 'joule', title: '3. Thí nghiệm Joule', icon: '⚙️', tag: 'Tính toán Năng lượng',
            desc: 'Mô phỏng quả nặng rơi làm quay cánh khuấy chứng minh sự chuyển hóa từ Cơ năng thành Nhiệt năng.',
            classes: { hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(251,191,36,0.15)]', blob: 'bg-amber-200/40', iconBg: 'bg-amber-100 text-amber-600', tagBg: 'text-amber-700 bg-amber-50', btnBg: 'text-amber-700 bg-amber-100/80 hover:bg-amber-200' }
          },
          {
            id: 'specific_heat', title: '4. Nhiệt Dung Riêng', icon: '🌷', tag: 'Đo lường Nhiệt lượng',
            desc: 'Xác định chiều truyền năng lượng nhiệt giữa cốc nước nóng và cốc nước lạnh tiếp xúc nhau.',
            classes: { hoverBorder: 'hover:border-pink-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(244,114,182,0.15)]', blob: 'bg-pink-200/40', iconBg: 'bg-pink-100 text-pink-500', tagBg: 'text-pink-600 bg-pink-50', btnBg: 'text-pink-600 bg-pink-100/80 hover:bg-pink-200' }
          },
          {
            id: 'latent_heat', title: '5. Nhiệt Nóng Chảy Riêng', icon: '🍧', tag: 'Phân tích Đồ thị T(t)',
            desc: 'Sử dụng nhiệt lượng kế hiện đại để xác định chính xác nhiệt nóng chảy riêng của nước đá ở 0°C.',
            classes: { hoverBorder: 'hover:border-fuchsia-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(232,121,249,0.15)]', blob: 'bg-fuchsia-200/40', iconBg: 'bg-fuchsia-100 text-fuchsia-500', tagBg: 'text-fuchsia-600 bg-fuchsia-50', btnBg: 'text-fuchsia-600 bg-fuchsia-100/80 hover:bg-fuchsia-200' }
          },
          {
            id: 'vaporization', title: '6. Nhiệt Hóa Hơi Riêng', icon: '♨️', tag: 'Phân tích Đồ thị M(t)',
            desc: 'Khảo sát quá trình đun sôi, hiện tượng hóa hơi và tính toán nhiệt lượng cần thiết để chuyển pha.',
            classes: { hoverBorder: 'hover:border-red-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(248,113,113,0.15)]', blob: 'bg-red-200/40', iconBg: 'bg-red-100 text-red-500', tagBg: 'text-red-600 bg-red-50', btnBg: 'text-red-600 bg-red-100/80 hover:bg-red-200' }
          }
        ]
      },
      {
        id: 'khi_li_tuong',
        title: 'Chuyên đề: Khí Lí Tưởng',
        icon: '☁️',
        headerColor: 'text-sky-600',
        borderColor: 'border-sky-200/80',
        experiments: [
          {
            id: 'boyle', title: '1. Định luật Boyle-Mariotte', icon: '🎈', tag: 'Khảo sát P-V',
            desc: 'Nén khí đẳng nhiệt: Quan sát mối liên hệ tỉ lệ nghịch giữa Áp suất và Thể tích của lượng khí xác định.',
            classes: { hoverBorder: 'hover:border-sky-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(125,211,252,0.15)]', blob: 'bg-sky-200/40', iconBg: 'bg-sky-100 text-sky-500', tagBg: 'text-sky-600 bg-sky-50', btnBg: 'text-sky-600 bg-sky-100/80 hover:bg-sky-200' }
          },
          {
            id: 'charles', title: '2. Định luật Charles', icon: '🫧', tag: 'Khảo sát V-T',
            desc: 'Giãn nở đẳng áp: Đun nóng chất khí và quan sát sự tăng lên của Thể tích tỉ lệ thuận với Nhiệt độ tuyệt đối.',
            classes: { hoverBorder: 'hover:border-cyan-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(103,232,249,0.15)]', blob: 'bg-cyan-200/40', iconBg: 'bg-cyan-100 text-cyan-600', tagBg: 'text-cyan-700 bg-cyan-50', btnBg: 'text-cyan-700 bg-cyan-100/80 hover:bg-cyan-200' }
          },
          {
            id: 'ideal_gas_law', title: '3. Phương trình Trạng thái', icon: '🎐', tag: 'Mô phỏng Động học',
            desc: 'Mô phỏng buồng chứa khí 3D: Tự do điều chỉnh Nhiệt độ, Áp suất, Thể tích và Số mol khí.',
            classes: { hoverBorder: 'hover:border-blue-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(147,197,253,0.15)]', blob: 'bg-blue-200/40', iconBg: 'bg-blue-100 text-blue-600', tagBg: 'text-blue-700 bg-blue-50', btnBg: 'text-blue-700 bg-blue-100/80 hover:bg-blue-200' }
          }
        ]
      },
      {
        id: 'tu_truong',
        title: 'Chuyên đề: Từ Trường',
        icon: '🔮',
        headerColor: 'text-violet-600',
        borderColor: 'border-violet-200/80',
        experiments: [
          {
            id: 'magnetic_field', title: '1. Từ phổ & Từ trường', icon: '🧲', tag: 'Quan sát Từ phổ',
            desc: 'Rắc mạt sắt xung quanh nam châm chữ U và nam châm thẳng để vẽ lại đường sức từ trong không gian 3D.',
            classes: { hoverBorder: 'hover:border-violet-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(196,181,253,0.15)]', blob: 'bg-violet-200/40', iconBg: 'bg-violet-100 text-violet-600', tagBg: 'text-violet-700 bg-violet-50', btnBg: 'text-violet-700 bg-violet-100/80 hover:bg-violet-200' }
          },
          {
            id: 'lorentz', title: '2. Lực Lorentz', icon: '💫', tag: 'Phân tích Lực',
            desc: 'Bắn hạt điện tích bay vào vùng từ trường đều và phân tích quỹ đạo cong của hạt dưới tác dụng của lực Lorentz.',
            classes: { hoverBorder: 'hover:border-purple-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(216,180,254,0.15)]', blob: 'bg-purple-200/40', iconBg: 'bg-purple-100 text-purple-600', tagBg: 'text-purple-700 bg-purple-50', btnBg: 'text-purple-700 bg-purple-100/80 hover:bg-purple-200' }
          },
          {
            id: 'faraday', title: '3. Cảm ứng Điện từ', icon: '✨', tag: 'Đo lường Dòng điện',
            desc: 'Thí nghiệm Faraday: Đẩy nam châm xuyên qua cuộn dây dẫn kín để tạo ra dòng điện cảm ứng xoay chiều.',
            classes: { hoverBorder: 'hover:border-indigo-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(165,180,252,0.15)]', blob: 'bg-indigo-200/40', iconBg: 'bg-indigo-100 text-indigo-600', tagBg: 'text-indigo-700 bg-indigo-50', btnBg: 'text-indigo-700 bg-indigo-100/80 hover:bg-indigo-200' }
          }
        ]
      },
      {
        id: 'hat_nhan',
        title: 'Chuyên đề: Vật lý Hạt Nhân',
        icon: '🍵',
        headerColor: 'text-teal-600',
        borderColor: 'border-teal-200/80',
        experiments: [
          {
            id: 'nucleus_structure', title: '1. Cấu tạo Hạt nhân', icon: '🌸', tag: 'Khám phá Vi mô',
            desc: 'Khám phá cấu trúc siêu vi mô của nguyên tử: Hạt nhân (Proton, Neutron) và lớp vỏ Electron.',
            classes: { hoverBorder: 'hover:border-teal-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(94,234,212,0.15)]', blob: 'bg-teal-200/40', iconBg: 'bg-teal-100 text-teal-600', tagBg: 'text-teal-700 bg-teal-50', btnBg: 'text-teal-700 bg-teal-100/80 hover:bg-teal-200' }
          },
          {
            id: 'radioactivity', title: '2. Hiện tượng Phóng xạ', icon: '🌟', tag: 'Mô phỏng Phân rã',
            desc: 'Khảo sát chu kỳ bán rã và khả năng đâm xuyên của các tia phóng xạ Alpha (α), Beta (β), Gamma (γ).',
            classes: { hoverBorder: 'hover:border-emerald-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(110,231,183,0.15)]', blob: 'bg-emerald-200/40', iconBg: 'bg-emerald-100 text-emerald-600', tagBg: 'text-emerald-700 bg-emerald-50', btnBg: 'text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200' }
          },
          {
            id: 'fission', title: '3. Phản ứng Phân hạch', icon: '🎇', tag: 'Quan sát Năng lượng',
            desc: 'Mô phỏng phản ứng dây chuyền: Bắn nơtron chậm vào hạt nhân Uranium-235 để giải phóng năng lượng.',
            classes: { hoverBorder: 'hover:border-green-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(134,239,172,0.15)]', blob: 'bg-green-200/40', iconBg: 'bg-green-100 text-green-600', tagBg: 'text-green-700 bg-green-50', btnBg: 'text-green-700 bg-green-100/80 hover:bg-green-200' }
          }
        ]
      }
    ]
  },
  {
    id: 'grade-11',
    title: 'Vật Lý 11',
    icon: '⚡',
    isReady: true,
    topics: [
      {
        id: 'dao_dong_co',
        title: 'Chuyên đề: Dao Động Cơ',
        icon: '⏳',
        headerColor: 'text-amber-600',
        borderColor: 'border-amber-200/80',
        experiments: [
          {
            id: 'harmonic_motion', title: '1. DĐĐH & CĐ Tròn Đều', icon: '🎡', tag: 'Quan sát Hình chiếu',
            desc: 'Trực quan hóa mối liên hệ giữa dao động điều hòa của con lắc lò xo và hình chiếu của chuyển động tròn đều.',
            classes: { hoverBorder: 'hover:border-amber-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(251,191,36,0.15)]', blob: 'bg-amber-200/40', iconBg: 'bg-amber-100 text-amber-600', tagBg: 'text-amber-700 bg-amber-50', btnBg: 'text-amber-700 bg-amber-100/80 hover:bg-amber-200' }
          },
          {
            id: 'damped_oscillation', title: '2. Dao động Tắt dần', icon: '📉', tag: 'Đồ thị Động',
            desc: 'Khảo sát sự suy giảm biên độ của con lắc theo thời gian dưới tác dụng của lực cản môi trường.',
            classes: { hoverBorder: 'hover:border-rose-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(225,29,72,0.15)]', blob: 'bg-rose-200/40', iconBg: 'bg-rose-100 text-rose-600', tagBg: 'text-rose-700 bg-rose-50', btnBg: 'text-rose-700 bg-rose-100/80 hover:bg-rose-200' }
          },
          // ĐÃ THÊM: BÀI THỰC HÀNH CỘNG HƯỞNG & DAO ĐỘNG CƯỠNG BỨC
          {
            id: 'forced_resonance', title: '3. Cộng hưởng Cơ', icon: '🌊', tag: 'Mô phỏng Năng lượng',
            desc: 'Khảo sát dao động cưỡng bức của hệ nhiều con lắc và điều kiện xảy ra hiện tượng cộng hưởng.',
            classes: { hoverBorder: 'hover:border-orange-300', hoverShadow: 'hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]', blob: 'bg-orange-200/40', iconBg: 'bg-orange-100 text-orange-600', tagBg: 'text-orange-700 bg-orange-50', btnBg: 'text-orange-700 bg-orange-100/80 hover:bg-orange-200' }
          }
        ]
      }
    ]
  },
  {
    id: 'grade-10',
    title: 'Vật Lý 10',
    icon: '🚀',
    isReady: false,
    topics: []
  }
];

export default function App() {
  const [activeExperiment, setActiveExperiment] = useState<string | null>(null);
  
  // Trạng thái mở thư mục Lớp (Mặc định mở Lớp 11 để test bài mới)
  const [openFolder, setOpenFolder] = useState<string | null>('grade-11');
  
  // Trạng thái mở Chuyên đề (Mặc định mở chuyên đề Dao động cơ)
  const [openTopic, setOpenTopic] = useState<string | null>('dao_dong_co');

  const handleToggleFolder = (folderId: string, isReady: boolean) => {
    if (!isReady) {
      playAudio('locked');
      return;
    }
    playAudio('open');
    setOpenFolder(openFolder === folderId ? null : folderId);
    setOpenTopic(null); // Reset chuyên đề khi đổi lớp
  };

  const handleToggleTopic = (topicId: string) => {
    playAudio('click');
    setOpenTopic(openTopic === topicId ? null : topicId);
  };

  const startExperiment = (expId: string) => {
    playAudio('click');
    setActiveExperiment(expId);
  };

  // ==========================================
  // BỘ ĐỊNH TUYẾN (ROUTER)
  // ==========================================
  
  // LỚP 12
  if (activeExperiment === 'brownian') return <BrownianMotion onBack={() => setActiveExperiment(null)} />;
  if (activeExperiment === 'internal_energy') return <InternalEnergy onBack={() => setActiveExperiment(null)} />;
  if (activeExperiment === 'joule') return <JouleExperiment onBack={() => setActiveExperiment(null)} />; 
  if (activeExperiment === 'specific_heat') return <SpecificHeatExperiment onBack={() => setActiveExperiment(null)} />; 
  if (activeExperiment === 'latent_heat') return <LatentHeatExperiment onBack={() => setActiveExperiment(null)} />; 
  if (activeExperiment === 'vaporization') return <VaporizationExperiment onBack={() => setActiveExperiment(null)} />; 
  if (activeExperiment === 'boyle') return <BoyleExperiment onBack={() => setActiveExperiment(null)} />;
  if (activeExperiment === 'charles') return <CharlesExperiment onBack={() => setActiveExperiment(null)} />;

  // LỚP 11
  if (activeExperiment === 'harmonic_motion') return <HarmonicMotion onBack={() => setActiveExperiment(null)} />;
  if (activeExperiment === 'damped_oscillation') return <DampedOscillation onBack={() => setActiveExperiment(null)} />;
  // ĐÃ THÊM ROUTE CHO BÀI CỘNG HƯỞNG
  if (activeExperiment === 'forced_resonance') return <ForcedResonance onBack={() => setActiveExperiment(null)} />;

  // MÀN HÌNH CHỜ (PLACEHOLDER CHO CÁC BÀI CHƯA CÓ CODE)
  const activeExpData = FOLDERS.flatMap(f => f.topics).flatMap(t => t.experiments).find(e => e?.id === activeExperiment);
  if (activeExpData) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="bg-white/70 backdrop-blur-2xl border border-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] max-w-lg w-full relative z-10">
          <div className="text-6xl mb-6">{activeExpData.icon}</div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-3">{activeExpData.title.split('. ')[1]}</h2>
          <p className="text-purple-600/80 text-sm mb-8 leading-relaxed">Hệ thống mô phỏng 3D cho bài học này đang được đội ngũ Kỹ sư phát triển. Vui lòng quay lại sau nhé!</p>
          <button onClick={() => setActiveExperiment(null)} className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-full shadow-lg shadow-fuchsia-500/25 transition-all transform hover:scale-105">
            ← Quay lại Trang chủ
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // GIAO DIỆN TRANG CHỦ (CẤU TRÚC FOLDER)
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100 p-6 md:p-12 flex flex-col items-center relative overflow-x-hidden font-sans selection:bg-fuchsia-300 selection:text-fuchsia-900">
      
      {/* 🌸 BLOB TRANG TRÍ NỀN (AURA EFFECT) */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-pink-300/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[450px] h-[450px] bg-cyan-300/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER LOGO */}
      <header className="text-center mb-12 mt-6 relative z-10 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 tracking-tight drop-shadow-sm uppercase mb-4 py-2 leading-normal">
          HỆ THỐNG THÍ NGHIỆM VẬT LÝ ẢO
        </h1>
        <p className="text-purple-700/80 text-sm md:text-base font-medium tracking-wide">
          Khám phá và Luyện tập các định luật Vật lý cực chill qua mô phỏng 3D tương tác ✨
        </p>
      </header>

      {/* CẤU TRÚC THƯ MỤC CẤP BẬC */}
      <main className="w-full max-w-4xl flex flex-col gap-5 relative z-10">
        {FOLDERS.map((folder, index) => {
          const isFolderOpen = openFolder === folder.id;

          return (
            <motion.div 
              key={folder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`w-full rounded-[1.5rem] overflow-hidden transition-all duration-300 ${isFolderOpen ? 'bg-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] ring-1 ring-purple-200 backdrop-blur-xl' : 'bg-white/40 hover:bg-white/60 shadow-sm border border-white/50 backdrop-blur-md'}`}
            >
              
              {/* THANH TIÊU ĐỀ LỚP HỌC */}
              <button 
                onClick={() => handleToggleFolder(folder.id, folder.isReady)}
                className="w-full px-6 py-5 flex items-center justify-between outline-none"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl filter drop-shadow-sm">{folder.icon}</span>
                  <h2 className={`text-xl md:text-2xl font-black ${folder.isReady ? 'text-slate-800' : 'text-slate-400'}`}>
                    {folder.title}
                  </h2>
                  {!folder.isReady && (
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-slate-200">
                      Sắp ra mắt
                    </span>
                  )}
                </div>
                
                {folder.isReady && (
                  <motion.div 
                    animate={{ rotate: isFolderOpen ? 180 : 0 }} 
                    className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full"
                  >
                    ▼
                  </motion.div>
                )}
              </button>

              {/* KHÔNG GIAN BÊN TRONG LỚP (CÁC CHUYÊN ĐỀ) */}
              <AnimatePresence>
                {isFolderOpen && folder.isReady && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 flex flex-col gap-3">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent mb-4"></div>
                      
                      {folder.topics.map((topic) => {
                        const isTopicOpen = openTopic === topic.id;

                        return (
                          <div key={topic.id} className="flex flex-col">
                            
                            {/* THANH CHUYÊN ĐỀ */}
                            <button 
                              onClick={() => handleToggleTopic(topic.id)}
                              className={`w-full px-6 py-4 bg-white rounded-2xl flex items-center justify-between transition-all duration-300 border ${isTopicOpen ? 'border-purple-300 shadow-[0_10px_30px_rgba(168,85,247,0.15)] scale-[1.01] z-10 relative' : 'border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-purple-200'}`}
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-2xl">{topic.icon}</span>
                                <span className={`text-base md:text-lg font-bold tracking-wide ${topic.headerColor}`}>
                                  {topic.title}
                                </span>
                              </div>
                              <motion.span animate={{ rotate: isTopicOpen ? 180 : 0 }} className="text-slate-400 text-sm">
                                ▼
                              </motion.span>
                            </button>

                            {/* DANH SÁCH BÀI THÍ NGHIỆM */}
                            <AnimatePresence>
                              {isTopicOpen && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }} 
                                  animate={{ height: 'auto', opacity: 1 }} 
                                  exit={{ height: 0, opacity: 0 }} 
                                  className="overflow-hidden relative z-0"
                                >
                                  <div className="pt-6 pb-2 px-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {topic.experiments?.map((exp) => (
                                      <div 
                                        key={exp.id}
                                        onClick={() => startExperiment(exp.id)}
                                        className={`group bg-white/70 backdrop-blur-xl border border-white/80 p-6 md:p-8 rounded-[1.5rem] cursor-pointer relative overflow-hidden flex flex-col transition-all duration-300 ${exp.classes.hoverBorder} ${exp.classes.hoverShadow} hover:scale-[1.03] hover:bg-white/90 shadow-[0_8px_20px_rgb(0,0,0,0.03)]`}
                                      >
                                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-10 transition-transform duration-700 group-hover:scale-150 ${exp.classes.blob}`}></div>
                                        
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm border border-white ${exp.classes.iconBg}`}>
                                          {exp.icon}
                                        </div>
                                        
                                        <h3 className="text-lg font-extrabold text-slate-800 mb-2">{exp.title}</h3>
                                        <p className="text-slate-600/80 text-xs md:text-sm leading-relaxed flex-1 font-medium">{exp.desc}</p>
                                        
                                        <div className="mt-6 flex justify-between items-center text-[10px] md:text-xs font-bold tracking-wider">
                                          <span className={`px-3 py-1.5 rounded-full border border-white/60 shadow-xs ${exp.classes.tagBg}`}>
                                            {exp.tag}
                                          </span>
                                          <span className={`px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 font-extrabold shadow-sm ${exp.classes.btnBg}`}>
                                            Bắt đầu ➔
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </main>
    </div>
  );
}