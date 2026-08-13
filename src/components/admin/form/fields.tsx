import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-control border border-border bg-card-secondary/60 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 disabled:opacity-50";

type FieldShellProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  inputId: string;
  children: ReactNode;
};

function FieldShell({
  label,
  hint,
  error,
  required,
  className,
  inputId,
  children,
}: FieldShellProps) {
  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-semibold tracking-wide text-secondary"
      >
        {label}
        {required && <span className="ml-1 text-electric">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs leading-relaxed text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

type CommonFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

export function TextField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: CommonFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputId = useId();
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      inputId={inputId}
    >
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(inputClass, error && "border-danger/60 focus:border-danger")}
        {...props}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: CommonFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = useId();
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      inputId={inputId}
    >
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(
          inputClass,
          "min-h-[7rem] resize-y leading-relaxed",
          error && "border-danger/60 focus:border-danger"
        )}
        {...props}
      />
    </FieldShell>
  );
}

export function NumberField({
  label,
  hint,
  error,
  required,
  className,
  ...props
}: CommonFieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputId = useId();
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      inputId={inputId}
    >
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        aria-invalid={error ? true : undefined}
        className={cn(
          inputClass,
          "tabular-nums",
          error && "border-danger/60 focus:border-danger"
        )}
        {...props}
      />
    </FieldShell>
  );
}

type SelectOption = { value: string; label: string };

export function SelectField({
  label,
  hint,
  error,
  required,
  className,
  options,
  ...props
}: CommonFieldProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[] }) {
  const inputId = useId();
  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
      inputId={inputId}
    >
      <select
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(
          inputClass,
          "appearance-none",
          error && "border-danger/60 focus:border-danger"
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function CheckboxField({
  label,
  hint,
  checked,
  onCheckedChange,
  disabled,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={className}>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-electric)]"
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-secondary">
            {label}
          </span>
          {hint && (
            <span className="mt-0.5 block text-xs leading-relaxed text-muted">
              {hint}
            </span>
          )}
        </span>
      </label>
    </div>
  );
}