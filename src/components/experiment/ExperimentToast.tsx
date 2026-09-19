export type ExperimentToastTone =
  | "success"
  | "error"
  | "info";

export type ExperimentToastProps = {
  className: string;

  tone: ExperimentToastTone;

  message: string;
};

export default function ExperimentToast({
  className,
  tone,
  message,
}: ExperimentToastProps) {
  const isError =
    tone === "error";

  return (
    <div
      className={`${className} ${className}--${tone}`}
      role={
        isError
          ? "alert"
          : "status"
      }
      aria-live={
        isError
          ? "assertive"
          : "polite"
      }
    >
      {message}
    </div>
  );
}