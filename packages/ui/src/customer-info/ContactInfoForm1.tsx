"use client";
import { ContactInfoFormProps } from "../types";
import { useCustomerInfoForm, useBookingContext } from "@skybooking/hooks";
import { useRouter } from "next/navigation";

// Biến thể 1: form thông tin liên hệ trước khi gửi OTP.
export function ContactInfoForm1({ heading }: ContactInfoFormProps) {
  const { name, setName, phone, setPhone, email, setEmail, isValid, saveAndContinue } =
    useCustomerInfoForm();
  const { tenant, storeId } = useBookingContext();
  const router = useRouter();

  const goToOtp = () => {
    if (saveAndContinue()) router.push(`/${tenant}/${storeId}/otp`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 font-body">
      <h2 className="text-xl font-heading font-medium text-ink mb-4">{heading}</h2>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        <div className="mb-4">
          <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-1.5">Họ và tên *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-ink"
          />
        </div>
        <div className="mb-4">
          <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-1.5">Số điện thoại *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901 234 567"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-ink"
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-ink"
        />
      </div>

      <button
        onClick={goToOtp}
        disabled={!isValid}
        className="w-full md:w-auto md:px-10 bg-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-40"
      >
        Gửi mã OTP →
      </button>
    </div>
  );
}
