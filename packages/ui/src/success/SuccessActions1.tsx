"use client";
import { SuccessActionsProps } from "../types";
import { useBookingContext, clearBookingDraft } from "@skybooking/hooks";
import { useRouter } from "next/navigation";

// Biến thể 1: nút "Về trang chủ" + "Hủy bookings này".
export function SuccessActions1(_props: SuccessActionsProps) {
  const { tenant } = useBookingContext();
  const router = useRouter();

  const goHome = () => {
    clearBookingDraft();
    router.push(`/${tenant}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 font-body">
      <button onClick={goHome} className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold mb-2">
        Về trang chủ
      </button>
      <button className="w-full py-3 rounded-xl font-medium text-sm text-red-600 border border-red-200">
        Hủy booking này
      </button>
    </div>
  );
}
