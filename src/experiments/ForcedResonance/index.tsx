import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Intro from './Intro';
import Preparation from './Preparation';
import Experiment from './Experiment';
import Conclusion from './Conclusion';
import Practice from './Practice';
import Report from './Report';

const STEPS = ['Giới thiệu', 'Chuẩn bị', 'Thực hành', 'Kết luận', 'Luyện tập', 'Báo cáo'];

export default function ForcedResonanceModule({ onBack }: { onBack: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Intro onNext={() => setCurrentStep(1)} />;
      case 1: return <Preparation onNext={() => setCurrentStep(2)} onPrev={() => setCurrentStep(0)} />;
      case 2: return <Experiment onNext={() => setCurrentStep(3)} onPrev={() => setCurrentStep(1)} />;
      case 3: return <Conclusion onNext={() => setCurrentStep(4)} onPrev={() => setCurrentStep(2)} />;
      case 4: return <Practice onNext={() => setCurrentStep(5)} onPrev={() => setCurrentStep(3)} />;
      case 5: return <Report onPrev={() => setCurrentStep(4)} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-screen print:h-auto bg-slate-50 flex flex-col print:block overflow-hidden print:overflow-visible font-sans">
      <header className="print:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-colors">
            ← Quay lại
          </button>
          <h1 className="text-lg md:text-xl font-black text-amber-600 hidden md:block uppercase tracking-wide">
            CỘNG HƯỞNG & DAO ĐỘNG CƯỠNG BỨC
          </h1>
        </div>
        
        <div className="flex gap-1 md:gap-2">
          {STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${currentStep === idx ? 'bg-amber-600 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
            >
              <span className="hidden md:inline">{idx + 1}. </span>{step}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden print:overflow-visible print:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full print:h-auto print:block"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}