"use client";
import { DateTimePartyFormProps } from "../types";
import { useStoreDetail, useBookingContext } from "@skybooking/hooks";
import { useRouter } from "next/navigation";

// Biến thể 1: form chọn ngày/giờ/số khách + CTA + dialog vượt công suất.
export function DateTimePartyForm1({ title }: DateTimePartyFormProps) {
  const {
    date,
    setDate,
    time,
    setTime,
    timeSlots,
    partySize,
    incParty,
    decParty,
    tryContinue,
    showCapacityDialog,
    dismissCapacityDialog,
  } = useStoreDetail();
  const { tenant, storeId } = useBookingContext();
  const router = useRouter();

  const goToTables = () => {
    if (tryContinue()) router.push(`/${tenant}/${storeId}/tables`);
  };

  return (
    <div className="max-w-lg md:max-w-3xl mx-auto px-4 py-4 font-body">
      <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-4">{title}</div>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        <div>
          <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-1.5">Ngày</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full mb-4 px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-ink"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-1.5">Số khách</label>
          <div className="flex items-center justify-between border border-gray-300 rounded-xl h-11 mb-4 overflow-hidden">
            <button onClick={decParty} className="w-11 h-full text-primary text-xl">
              −
            </button>
            <div className="font-semibold text-ink">{partySize}</div>
            <button onClick={incParty} className="w-11 h-full text-primary text-xl">
              +
            </button>
          </div>
        </div>
      </div>

      <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-2">Khung giờ</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => setTime(slot)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border ${
              time === slot ? "bg-primary text-white border-primary" : "border-gray-300 text-ink"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      <button onClick={goToTables} className="w-full md:w-auto md:px-10 bg-primary text-white py-3.5 rounded-xl font-semibold">
        Xem bàn trống →
      </button>

      {showCapacityDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl md:rounded-3xl p-6 w-full max-w-lg">
            <div className="font-heading text-lg font-bold text-red-600 mb-2">Vượt quá công suất</div>
            <p className="text-sm text-ink-muted mb-4">
              Số lượng khách vượt quá khả năng phục vụ trong khung giờ này. Vui lòng liên hệ hotline để được tư vấn.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
              <div className="text-xs text-ink-muted">Hotline đặt bàn</div>
              <div className="font-heading text-lg font-bold text-primary">1800 9999</div>
            </div>
            <button onClick={dismissCapacityDialog} className="w-full bg-gray-100 py-3 rounded-xl font-medium text-ink-muted">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
