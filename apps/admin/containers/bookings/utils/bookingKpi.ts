import { BookingStatus, type Booking } from "@skybooking/api-client";
import type { BookingKpi } from "../components/BookingKpiRow";

export function computeBookingKpi(bookings: Booking[]): BookingKpi {
  return {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === BookingStatus.Confirmed).length,
    cancelled: bookings.filter(
      (b) => b.status === BookingStatus.Cancelled || b.status === BookingStatus.NoShow
    ).length,
  };
}
