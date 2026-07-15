"use client";

import {
  BookingContextProvider,
  buildCreateBookingPayload,
  usePageTheme,
  type WaitlistSubmitData,
} from "@skybooking/hooks";
import { bookingsApi, waitlistApi, BookingSource, type StoreTheme } from "@skybooking/api-client";

export function BookingPageShell({
  tenant,
  storeId,
  theme,
  enableCreateBooking,
  enableSubmitWaitlist,
  children,
}: {
  tenant: string;
  storeId: string | null;
  theme: StoreTheme;
  enableCreateBooking?: boolean;
  enableSubmitWaitlist?: boolean;
  children: React.ReactNode;
}) {
  usePageTheme(theme);

  const submitWaitlist =
    enableSubmitWaitlist && storeId
      ? async (data: WaitlistSubmitData) => {
          await waitlistApi.submit({
            storeId,
            customer: { name: data.name, phone: data.phone },
            partySize: data.partySize,
            preferredTime: data.preferredTime,
          });
        }
      : undefined;

  const createBooking = enableCreateBooking
    ? (data: {
        date: string;
        time: string;
        partySize: number;
        tableIds: string[];
        customer: { name: string; phone: string; email?: string };
      }) =>
        bookingsApi.create(
          buildCreateBookingPayload(
            {
              storeId: storeId ?? "",
              date: data.date,
              time: data.time,
              partySize: data.partySize,
              tableIds: data.tableIds,
              customer: { ...data.customer, note: undefined },
            },
            BookingSource.Web
          )
        )
    : undefined;

  return (
    <BookingContextProvider value={{ tenant, storeId, submitWaitlist, createBooking }}>
      {children}
    </BookingContextProvider>
  );
}
