import {
  useEffect,
  useRef,
} from "react";

export type ExperimentPhaseItem = {
  id: string;
  label: string;
  disabled?: boolean;
};

type ExperimentPhaseNavProps = {
  items: ExperimentPhaseItem[];
  activePhase: string;
  onPhaseChange: (phaseId: string) => void;
  ariaLabel?: string;
};

export default function ExperimentPhaseNav({
  items,
  activePhase,
  onPhaseChange,
  ariaLabel = "Điều hướng các bước thí nghiệm",
}: ExperimentPhaseNavProps) {
  const activeItemRef =
    useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activePhase]);

  return (
    <nav
      className="experiment-phase-nav"
      aria-label={ariaLabel}
    >
      <div className="experiment-phase-nav__track">
        {items.map((item) => {
          const isActive =
            item.id === activePhase;

          return (
            <button
              key={item.id}
              ref={
                isActive
                  ? activeItemRef
                  : null
              }
              type="button"
              className={`experiment-phase-nav__item ${
                isActive
                  ? "experiment-phase-nav__item--active"
                  : ""
              }`}
              onClick={() =>
                onPhaseChange(item.id)
              }
              disabled={item.disabled}
              aria-current={
                isActive
                  ? "step"
                  : undefined
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}