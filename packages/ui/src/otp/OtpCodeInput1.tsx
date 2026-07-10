"use client";
import { useEffect, useState } from "react";
import { OtpCodeInputProps } from "../types";
import { useOtpVerification, readBookingDraft, writeBookingDraft, useBookingContext } from "@skybooking/hooks";
import { ApiError, BOOKING_ERROR_DEFAULT_MESSAGE_VI } from "@skybooking/api-client";
import { useRouter } from "next/navigation";

function createBookingErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.errorNumber != null && BOOKING_ERROR_DEFAULT_MESSAGE_VI[err.errorNumber]) {
      return BOOKING_ERROR_DEFAULT_MESSAGE_VI[err.errorNumber];
    }
    return err.message;
  }
  return "Không thể tạo bookings, vui lòng thử lại.";
}

// Biến thể 1: 6 ô nhập OTP + đếm ngược + CTA xác nhận (tạo bookings thật khi thành công).
export function OtpCodeInput1(_props: OtpCodeInputProps) {
  const [phone, setPhone] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  useEffect(() => {
    setPhone(readBookingDraft().phone ?? "");
  }, []);
  const { digits, setDigit, countdown, canResend, resend, confirm, isVerifying, error } =
    useOtpVerification(phone);
  const { tenant, storeId, createBooking } = useBookingContext();
  const router = useRouter();

  const handleConfirm = async () => {
    const ok = await confirm();
    if (!ok || !createBooking) return;

    setCreateError(null);
    setIsCreatingBooking(true);
    try {
      const draft = readBookingDraft();
      const booking = await createBooking({
        date: draft.date ?? "",
        time: draft.time ?? "",
        partySize: draft.partySize ?? 1,
        tableIds: draft.tableIds ?? [],
        customer: {
          name: draft.name ?? "",
          phone: draft.phone ?? phone,
          email: draft.email,
        },
      });
      writeBookingDraft({ bookingCode: booking.bookingCode });
      router.push(`/${tenant}/${storeId}/success`);
    } catch (err) {
      setCreateError(createBookingErrorMessage(err));
    } finally {
      setIsCreatingBooking(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col items-center font-body">
      <div className="flex gap-2 mb-5">
        {digits.map((d, i) => (
          <input
            key={i}
            maxLength={1}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            className="w-11 h-13 text-center text-xl font-bold border-2 border-gray-300 rounded-xl text-ink"
          />
        ))}
      </div>

      <div className="text-xs text-ink-muted mb-5 text-center">
        {canResend ? (
          <button onClick={resend} className="text-primary font-medium">
            Gửi lại mã OTP
          </button>
        ) : (
          <span>
            Gửi lại sau <span className="text-primary font-semibold">{countdown}</span>s
          </span>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-xs text-green-700 text-center mb-5 w-full">
        Mã thử nghiệm: <strong>123456</strong>
      </div>

      {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
      {createError && <p className="text-xs text-red-600 mb-4">{createError}</p>}

      <button
        onClick={handleConfirm}
        disabled={isVerifying || isCreatingBooking}
        className="w-full md:w-auto md:px-10 bg-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-50"
      >
        Xác nhận booking
      </button>
    </div>
  );
}
