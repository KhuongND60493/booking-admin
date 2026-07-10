"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storesApi, storeKeys } from "@skybooking/api-client";
import { useBookingContext } from "./BookingContext";
import { writeBookingDraft } from "./bookingDraft";

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];
const MAX_PARTY_SIZE = 20;

export function useStoreDetail() {
  const { storeId } = useBookingContext();
  const [date, setDate] = useState("");
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [partySize, setPartySize] = useState(2);
  const [showCapacityDialog, setShowCapacityDialog] = useState(false);

  const { data: store = null, error } = useQuery({
    queryKey: storeKeys.detail(storeId ?? ""),
    queryFn: () => storesApi.getOne(storeId!),
    enabled: !!storeId,
  });

  const incParty = () => setPartySize((p) => p + 1);
  const decParty = () => setPartySize((p) => Math.max(1, p - 1));

  const tryContinue = (): boolean => {
    if (partySize > MAX_PARTY_SIZE) {
      setShowCapacityDialog(true);
      return false;
    }
    writeBookingDraft({ date, time, partySize });
    return true;
  };

  const dismissCapacityDialog = () => setShowCapacityDialog(false);

  return {
    store,
    error,
    date,
    setDate,
    time,
    setTime,
    timeSlots: TIME_SLOTS,
    partySize,
    incParty,
    decParty,
    tryContinue,
    showCapacityDialog,
    dismissCapacityDialog,
  };
}
