import type {
  ReactNode,
} from "react";

import ExperimentPhaseNav from "./ExperimentPhaseNav";

import type {
  ExperimentPhaseDefinition,
} from "../../experiments/shared/model";

export type ExperimentViewShellProps<
  TPhaseId extends string,
> = {
  viewClassName: string;

  phases: readonly ExperimentPhaseDefinition<
    TPhaseId
  >[];

  activePhase: TPhaseId;

  onPhaseChange: (
    phaseId: string,
  ) => void;

  ariaLabel: string;

  workspaceExpanded: boolean;

  isPractice: boolean;

  utilityActions: ReactNode;

  children: ReactNode;
};

export default function ExperimentViewShell<
  TPhaseId extends string,
>({
  viewClassName,
  phases,
  activePhase,
  onPhaseChange,
  ariaLabel,
  workspaceExpanded,
  isPractice,
  utilityActions,
  children,
}: ExperimentViewShellProps<TPhaseId>) {
  const currentPhaseIndex =
    phases.findIndex(
      (phase) =>
        phase.id === activePhase,
    );

  const currentPhase =
    phases[currentPhaseIndex];

  return (
    <div
      className={`experiment-template ${viewClassName} ${
        workspaceExpanded
          ? `${viewClassName}--expanded`
          : ""
      }`}
    >
      <ExperimentPhaseNav
        items={[...phases]}
        activePhase={activePhase}
        onPhaseChange={
          onPhaseChange
        }
        ariaLabel={ariaLabel}
      />

      <div
        className={`${viewClassName}__body`}
      >
        <div
          className={`${viewClassName}__utility`}
        >
          <div
            className={`${viewClassName}__phase-info`}
          >
            <span>
              Bước{" "}
              {currentPhaseIndex + 1}
              {" / "}
              {phases.length}
            </span>

            <strong>
              {currentPhase?.title}
            </strong>
          </div>

          {utilityActions}
        </div>

        <main
          className={`${viewClassName}__stage ${
            isPractice
              ? `${viewClassName}__stage--practice`
              : `${viewClassName}__stage--content`
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}