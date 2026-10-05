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

export default function DampedOscillationModule() {
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
    <div className="grade11-module grade11-module--damped w-full h-full min-h-0 bg-slate-50 flex flex-col print:block overflow-hidden print:overflow-visible font-sans">
      <header className="grade11-module__phasebar print:hidden">
        <h2 className="grade11-module__phase-title text-rose-400">
          DAO ĐỘNG TẮT DẦN
        </h2>

        <nav
          className="grade11-module__phase-nav"
          aria-label="Các bước thí nghiệm dao động tắt dần"
        >
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
                className={`grade11-module__phase-button ${
                  currentStep ===
                  index
                    ? "bg-rose-600 text-white"
                    : ""
                }`}
              >
                <span>
                  {index + 1}.
                </span>

                {step}
              </button>
            ),
          )}
        </nav>
      </header>

      <main className="grade11-module__body">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -12,
            }}
            transition={{
              duration: 0.2,
            }}
            className="grade11-module__stage"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}