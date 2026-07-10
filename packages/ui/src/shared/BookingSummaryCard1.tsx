"use client";
import { useEffect, useState } from "react";
import { BookingSummaryCardProps } from "../types";
import { readBookingDraft, type BookingDraft } from "@skybooking/hooks";

// Biến thể 1: card tóm tắt đặt bàn — dùng chung ở Customer Info (showBookingCode=false)
// và Success (showBookingCode=true).
export function BookingSummaryCard1({ showBookingCode = false }: BookingSummaryCardProps) {
  const [draft, setDraft] = useState<BookingDraft>({});
  useEffect(() => {
    setDraft(readBookingDraft());
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 font-body">
      {showBookingCode && (
        <div className="bg-primary/5 border border-primary/25 rounded-2xl px-6 py-4 text-center w-full mb-4">
          <div className="text-[10px] text-ink-muted uppercase tracking-wide mb-1.5">Mã đặt bàn</div>
          <div className="font-mono text-2xl font-bold text-primary tracking-widest">
            {draft.bookingCode ?? "------"}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-4 w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">Ngày / Giờ</span>
          <span className="text-ink">
            {draft.date} · {draft.time}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-muted">Số khách</span>
          <span className="text-ink">{draft.partySize} người</span>
        </div>
      </div>
    </div>
  );
}
