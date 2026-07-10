"use client";
import { useEffect, useState } from "react";
import { OtpHeaderProps } from "../types";
import { readBookingDraft } from "@skybooking/hooks";

// Biến thể 1: icon + tiêu đề + "đã gửi về {phone}".
export function OtpHeader1({ heading }: OtpHeaderProps) {
  const [phone, setPhone] = useState("");
  useEffect(() => {
    setPhone(readBookingDraft().phone ?? "");
  }, []);

  const maskedPhone = phone ? phone.replace(/(\d{4})\d+(\d{3})/, "$1•••$2") : "";

  return (
    <div className="max-w-lg mx-auto px-4 pt-10 flex flex-col items-center font-body">
      <h2 className="text-lg font-heading font-medium text-ink mb-2 text-center">{heading}</h2>
      <p className="text-xs text-ink-muted text-center">
        Mã OTP đã gửi về <span className="text-primary font-medium">{maskedPhone}</span>
      </p>
    </div>
  );
}
