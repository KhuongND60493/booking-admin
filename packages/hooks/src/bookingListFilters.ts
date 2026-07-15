import type { BookingStatus } from "@skybooking/api-client";

export interface BookingListFilters {
  keyword?: string;
  dateFrom: string;
  dateTo: string;
  storeIds: number[];
  statuses: BookingStatus[];
}
