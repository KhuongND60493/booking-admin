import type { BookingQueryParams } from "./bookings-api";
import type { SearchTablesParams } from "./tables-api";
import type { AvailabilityParams } from "./availability-api";
import type { PageKey } from "./types";

export const bookingKeys = {
  all: ["bookings"] as const,
  lists: () => [...bookingKeys.all, "list"] as const,
  list: (params: BookingQueryParams) => [...bookingKeys.lists(), params] as const,
  details: () => [...bookingKeys.all, "detail"] as const,
  detail: (id: number) => [...bookingKeys.details(), id] as const,
  availability: (params: AvailabilityParams) => [...bookingKeys.all, "availability", params] as const,
};

export const storeKeys = {
  all: ["stores"] as const,
  lists: () => [...storeKeys.all, "list"] as const,
  list: () => [...storeKeys.lists()] as const,
  details: () => [...storeKeys.all, "detail"] as const,
  detail: (storeId: string | number) => [...storeKeys.details(), storeId] as const,
};

export const tableKeys = {
  all: ["tables"] as const,
  search: (params: SearchTablesParams) => [...tableKeys.all, "search", params] as const,
};

export const waitlistKeys = {
  all: ["waitlist"] as const,
  lists: () => [...waitlistKeys.all, "list"] as const,
  list: (storeId: string) => [...waitlistKeys.lists(), storeId] as const,
};

export const bookingTimeSlotKeys = {
  all: ["bookingTimeSlots"] as const,
  lists: () => [...bookingTimeSlotKeys.all, "list"] as const,
  list: (params: { storeIds?: number[]; isActive?: boolean; dayOfWeek?: number }) =>
    [...bookingTimeSlotKeys.lists(), params] as const,
};

export const bookingTableKeys = {
  all: ["bookingTables"] as const,
  lists: () => [...bookingTableKeys.all, "list"] as const,
  list: (params: { orgId?: number; storeIds?: number[]; isActive?: boolean }) =>
    [...bookingTableKeys.lists(), params] as const,
};

export const bookingSettingKeys = {
  all: ["bookingSettings"] as const,
  detail: (storeId: number) => [...bookingSettingKeys.all, storeId] as const,
};

export const storeThemeKeys = {
  all: ["storeTheme"] as const,
  detail: (storeId: string) => [...storeThemeKeys.all, storeId] as const,
};

export const pageConfigKeys = {
  all: ["pageConfig"] as const,
  detail: (storeId: string, page: PageKey) => [...pageConfigKeys.all, storeId, page] as const,
};
