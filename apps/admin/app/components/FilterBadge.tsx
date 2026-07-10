import type { ReactNode } from "react";

export interface FilterBadgeProps {
  children: ReactNode;
}

export function FilterBadge({ children }: FilterBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-admin-border px-1 text-xs font-normal text-admin-ink-soft p-1">
      {children}
    </span>
  );
}
