"use client";

import { createContext, useContext } from "react";
import type { WaitlistSubmitData } from "./useWaitlistForm";
import type { Booking } from "@skybooking/api-client";

export interface BookingContextValue {
  tenant: string;
  storeId: string | null;
  submitWaitlist?: (data: WaitlistSubmitData) => Promise<void>;
  createBooking?: (data: {
    date: string;
    time: string;
    partySize: number;
    tableIds: string[];
    customer: { name: string; phone: string; email?: string };
  }) => Promise<Booking>;
}

const BookingContext = createContext<BookingContextValue>({
  tenant: "",
  storeId: null,
});

export function BookingContextProvider({
  value,
  children,
}: {
  value: BookingContextValue;
  children: React.ReactNode;
}) {
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookingContext() {
  return useContext(BookingContext);
}
