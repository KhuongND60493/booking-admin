"use client";
import { WaitlistFormFieldsProps } from "../types";
import { useWaitlistForm } from "@skybooking/hooks";
import { WaitlistDone1 } from "./WaitlistDone1";

// Biến thể 1: form họ tên/SĐT/số khách/khung giờ + CTA đăng ký chờ bàn.
export function WaitlistFormFields1({ heading }: WaitlistFormFieldsProps) {
  const {
    name,
    setName,
    phone,
    setPhone,
    partySize,
    incParty,
    decParty,
    preferredTime,
    setPreferredTime,
    isValid,
    isDone,
    isSubmitting,
    submit,
  } = useWaitlistForm();

  if (isDone) return <WaitlistDone1 />;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 font-body">
      <h2 className="text-xl font-heading font-medium text-ink mb-4">{heading}</h2>

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
      <div className="mb-4">
        <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-1.5">Số khách</label>
        <div className="flex items-center justify-between border border-gray-300 rounded-xl h-11 overflow-hidden">
          <button onClick={decParty} className="w-11 h-full text-primary text-lg">
            −
          </button>
          <div className="font-semibold text-ink">{partySize}</div>
          <button onClick={incParty} className="w-11 h-full text-primary text-lg">
            +
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-[10px] font-semibold text-ink-muted uppercase mb-2">Khung giờ mong muốn</label>
        <div className="flex flex-wrap gap-2">
          {["18:00", "18:30", "19:00", "19:30", "20:00"].map((slot) => (
            <button
              key={slot}
              onClick={() => setPreferredTime(slot)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                preferredTime === slot ? "bg-primary text-white border-primary" : "border-gray-300 text-ink"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!isValid || isSubmitting}
        className="w-full md:w-auto md:px-10 bg-primary text-white py-3.5 rounded-xl font-semibold disabled:opacity-50"
      >
        Đăng ký chờ bàn
      </button>
    </div>
  );
}
