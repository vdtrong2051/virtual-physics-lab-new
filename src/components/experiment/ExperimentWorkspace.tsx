import type {
  ReactNode,
} from "react";

export type ExperimentWorkspaceProps = {
  className: string;

  railExpanded?: boolean;

  simulation: ReactNode;

  children?: ReactNode;
};

export default function ExperimentWorkspace({
  className,
  railExpanded = false,
  simulation,
  children,
}: ExperimentWorkspaceProps) {
  return (
    <div
      className={`${className} ${
        railExpanded
          ? `${className}--rail-expanded`
          : ""
      }`}
    >
      <div
        className={`${className}__simulation`}
      >
        {simulation}
      </div>

      {children}
    </div>
  );
}