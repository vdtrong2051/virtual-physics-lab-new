import {
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import Intro from "./Intro";
import Preparation from "./Preparation";
import Experiment from "./Experiment";
import Conclusion from "./Conclusion";
import Practice from "./Practice";
import Report from "./Report";

const STEPS = [
  "Giới thiệu",
  "Chuẩn bị",
  "Thực hành",
  "Kết luận",
  "Luyện tập",
  "Báo cáo",
];

export default function HarmonicMotionModule() {
  const [
    currentStep,
    setCurrentStep,
  ] = useState(0);

  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <Intro
            onNext={() =>
              setCurrentStep(1)
            }
          />
        );

      case 1:
        return (
          <Preparation
            onNext={() =>
              setCurrentStep(2)
            }
            onPrev={() =>
              setCurrentStep(0)
            }
          />
        );

      case 2:
        return (
          <Experiment
            onNext={() =>
              setCurrentStep(3)
            }
            onPrev={() =>
              setCurrentStep(1)
            }
          />
        );

      case 3:
        return (
          <Conclusion
            onNext={() =>
              setCurrentStep(4)
            }
            onPrev={() =>
              setCurrentStep(2)
            }
          />
        );

      case 4:
        return (
          <Practice
            onNext={() =>
              setCurrentStep(5)
            }
            onPrev={() =>
              setCurrentStep(3)
            }
          />
        );

      case 5:
        return (
          <Report
            onPrev={() =>
              setCurrentStep(4)
            }
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className="w-full h-screen print:h-auto bg-slate-50 flex flex-col print:block overflow-hidden print:overflow-visible font-sans">
      <header className="print:hidden min-h-16 bg-white border-b border-slate-200 flex items-center px-3 md:px-6 gap-4 shrink-0 z-20">
        <h1 className="text-lg md:text-xl font-black text-indigo-600 hidden lg:block uppercase tracking-wide shrink-0">
          DĐĐH & CHUYỂN ĐỘNG TRÒN ĐỀU
        </h1>

        <div className="flex gap-1 md:gap-2 overflow-x-auto ml-auto py-2">
          {STEPS.map(
            (
              step,
              index,
            ) => (
              <button
                type="button"
                key={step}
                onClick={() =>
                  setCurrentStep(
                    index,
                  )
                }
                className={`shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${
                  currentStep ===
                  index
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-transparent text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span className="hidden md:inline">
                  {index +
                    1}
                  .{" "}
                </span>

                {step}
              </button>
            ),
          )}
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden print:overflow-visible print:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="w-full h-full print:h-auto print:block"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}