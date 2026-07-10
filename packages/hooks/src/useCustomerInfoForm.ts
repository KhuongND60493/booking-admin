"use client";

import { useState } from "react";
import { writeBookingDraft } from "./bookingDraft";

// Logic nghiệp vụ DÙNG CHUNG cho trang Customer Info.
export function useCustomerInfoForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const isValid = name.trim().length > 0 && phone.trim().length >= 9;

  const saveAndContinue = (): boolean => {
    if (!isValid) return false;
    writeBookingDraft({ name, phone, email });
    return true;
  };

  return { name, setName, phone, setPhone, email, setEmail, isValid, saveAndContinue };
}
