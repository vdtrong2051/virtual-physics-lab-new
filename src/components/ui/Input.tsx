import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({
  label,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className="ui-input-group">
      {label && <span>{label}</span>}

      <input
        className={`ui-input ${className}`}
        {...props}
      />
    </label>
  );
}