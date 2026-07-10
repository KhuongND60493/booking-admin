"use client";

import { useEffect, useRef, useState } from "react";
import { otpApi } from "@skybooking/api-client";

const RESEND_SECONDS = 60;
const OTP_LENGTH = 6;

export function useOtpVerification(phone: string) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    otpApi.send(phone);
    intervalRef.current = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  const setDigit = (index: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value.slice(-1);
      return next;
    });
  };

  const resend = async () => {
    if (countdown > 0) return;
    await otpApi.send(phone);
    setCountdown(RESEND_SECONDS);
  };

  const confirm = async (): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    const ok = await otpApi.verify(phone, digits.join(""));
    setIsVerifying(false);
    if (!ok) setError("Mã OTP không đúng, vui lòng thử lại.");
    return ok;
  };

  return {
    digits,
    setDigit,
    countdown,
    canResend: countdown === 0,
    resend,
    confirm,
    isVerifying,
    error,
  };
}
