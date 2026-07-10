"use client";
import { ZoneTabsProps } from "../types";
import { useTableSelectionContext } from "@skybooking/hooks";

// Biến thể 1: tab theo khu vực — dùng chung state với TableGridBody1/TableSelectionSummary1.
export function ZoneTabs1(_props: ZoneTabsProps) {
  const { zones, activeZone, setActiveZone } = useTableSelectionContext();

  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto px-4 pt-6 font-body">
      <div className="flex border-b border-gray-200">
        {zones.map((z) => (
          <button
            key={z}
            onClick={() => setActiveZone(z)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeZone === z ? "border-primary text-primary" : "border-transparent text-ink-muted"
            }`}
          >
            {z}
          </button>
        ))}
      </div>
    </div>
  );
}
