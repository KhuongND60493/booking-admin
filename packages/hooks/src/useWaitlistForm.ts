"use client";

import { useState } from "react";
import { useBookingContext } from "./BookingContext";

export interface WaitlistSubmitData {
  name: string;
  phone: string;
  partySize: number;
  preferredTime: string;
}

export function useWaitlistForm() {
  const { submitWaitlist } = useBookingContext();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [preferredTime, setPreferredTime] = useState("18:00");
  const [isDone, setIsDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incParty = () => setPartySize((p) => p + 1);
  const decParty = () => setPartySize((p) => Math.max(1, p - 1));

  const isValid = name.trim().length > 0 && phone.trim().length >= 9;

  const submit = async () => {
    if (!isValid || !submitWaitlist) return;
    setIsSubmitting(true);
    await submitWaitlist({ name, phone, partySize, preferredTime });
    setIsSubmitting(false);
    setIsDone(true);
  };

  return {
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
  };
}
