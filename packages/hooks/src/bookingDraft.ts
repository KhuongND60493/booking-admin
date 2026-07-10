"use client";

// Lưu tạm state của luồng đặt bàn (ngày/giờ/số khách/bàn đã chọn/thông tin khách)
// giữa các route riêng biệt (Store Detail -> Table Selection -> Customer Info ->
// OTP -> Success), vì mỗi trang là 1 page.tsx độc lập, không share React state.
// Dùng sessionStorage — chỉ tồn tại trong phiên duyệt web hiện tại, đủ cho demo.

export interface BookingDraft {
  date?: string;
  time?: string;
  partySize?: number;
  tableIds?: string[];
  name?: string;
  phone?: string;
  email?: string;
  bookingCode?: string;
}

const KEY = "sb_booking_draft";

export function readBookingDraft(): BookingDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BookingDraft) : {};
  } catch {
    return {};
  }
}

export function writeBookingDraft(patch: BookingDraft): void {
  if (typeof window === "undefined") return;
  const current = readBookingDraft();
  sessionStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }));
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
