import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface FilterTriggerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  children?: ReactNode;
}

export const FilterTriggerButton = forwardRef<HTMLButtonElement, FilterTriggerButtonProps>(
  function FilterTriggerButton({ icon, children, className = "", ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex shrink-0 items-center justify-center gap-1.5 h-8 rounded-md border border-dashed border-admin-border bg-white px-3 text-sm font-medium text-admin-ink-soft shadow-sm transition-colors hover:bg-admin-bg ${className}`}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);
