"use client";
import { TableGridBodyProps } from "../types";
import { useTableSelectionContext } from "@skybooking/hooks";

// Biến thể 1: lưới bàn của zone đang active.
// Responsive: 2 cột mobile, 3 cột md:, 4 cột lg:.
export function TableGridBody1(_props: TableGridBodyProps) {
  const { zoneTables, isLoading, error, selectedIds, toggleTable } = useTableSelectionContext();

  if (isLoading) {
    return (
      <div className="max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto px-4">
        <p className="text-ink-muted text-sm">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto px-4">
        <p className="text-xs text-red-600">Không tải được danh sách bàn. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto px-4 py-4 font-body">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {zoneTables.map((tbl) => (
          <button
            key={tbl.id}
            disabled={!tbl.available}
            onClick={() => toggleTable(tbl.id)}
            className={`rounded-xl border-2 p-3 text-left ${
              selectedIds.includes(tbl.id)
                ? "bg-primary/10 border-primary"
                : tbl.available
                  ? "bg-white border-gray-200"
                  : "bg-gray-100 border-gray-200 opacity-50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink">{tbl.name}</span>
              {selectedIds.includes(tbl.id) && <span className="w-4 h-4 rounded-full bg-primary" />}
            </div>
            <div className="text-xs text-ink-muted mt-1">{tbl.capacity} chỗ</div>
            <div
              className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${
                tbl.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
              }`}
            >
              {tbl.available ? "Trống" : "Đã đặt"}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
