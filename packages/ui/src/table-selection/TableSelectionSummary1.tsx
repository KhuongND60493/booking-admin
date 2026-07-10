"use client";
import { TableSelectionSummaryProps } from "../types";
import { useTableSelectionContext, useBookingContext } from "@skybooking/hooks";
import { useRouter } from "next/navigation";

// Biến thể 1: cảnh báo multi-zone + tổng kết + CTA tiếp tục.
export function TableSelectionSummary1(_props: TableSelectionSummaryProps) {
  const { totalCapacity, selectedTablesCount, hasMultiZoneWarning, isEnoughCapacity } =
    useTableSelectionContext();
  const { tenant, storeId } = useBookingContext();
  const router = useRouter();

  return (
    <div className="max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto px-4 pb-6 font-body">
      {hasMultiZoneWarning && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-700 text-xs rounded-lg p-3 mb-3">
          Bàn chọn thuộc nhiều khu vực khác nhau. Bạn vẫn có thể tiếp tục.
        </div>
      )}

      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="text-ink-muted">
          {selectedTablesCount} bàn · {totalCapacity} chỗ
        </span>
        <span className={isEnoughCapacity ? "text-green-600 font-semibold" : "text-ink-muted"}>
          {isEnoughCapacity ? "Đủ chỗ" : "Chưa đủ chỗ"}
        </span>
      </div>

      <button
        onClick={() => router.push(`/${tenant}/${storeId}/info`)}
        disabled={selectedTablesCount === 0}
        className="w-full md:w-auto md:px-10 bg-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-40"
      >
        Tiếp tục →
      </button>
    </div>
  );
}
