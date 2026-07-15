import { LayoutGrid, List } from "lucide-react";
import type { TFunction } from "i18next";

export type ViewMode = "card" | "table";

export interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  t: TFunction;
}

const OPTIONS: { value: ViewMode; icon: typeof LayoutGrid; labelKey: string }[] = [
  { value: "card", icon: LayoutGrid, labelKey: "view.card" },
  { value: "table", icon: List, labelKey: "view.table" },
];

export function ViewToggle({ value, onChange, t }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-admin-border/60 p-0.5">
      {OPTIONS.map(({ value: optionValue, icon: Icon, labelKey }) => {
        const active = value === optionValue;
        return (
          <button
            key={optionValue}
            type="button"
            title={t(labelKey)}
            aria-label={t(labelKey)}
            onClick={() => onChange(optionValue)}
            className={`flex h-7 w-8 items-center justify-center rounded transition-colors ${
              active
                ? "bg-white text-admin-ink shadow-sm"
                : "text-admin-muted hover:text-admin-ink"
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
