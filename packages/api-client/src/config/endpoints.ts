import { ServiceName } from "./serviceRegistry";

export interface EndpointDefinition {
  service: ServiceName;
  base: string;
}

const MODULES = {
  booking: "/booking/api",
  masterdata: "/masterdata/api",
} as const;

function endpoint(
  base: string,
  service: ServiceName = ServiceName.Default,
): EndpointDefinition {
  return { service, base };
}

export const ENDPOINTS = {
  //Booking
  bookings: endpoint(`${MODULES.booking}/bookings`),
  otp: endpoint(`${MODULES.booking}/otp`),
  waitlist: endpoint(`${MODULES.booking}/waitlist`),
  menu: endpoint(`${MODULES.booking}/menu`),
  tables: endpoint(`${MODULES.booking}/tables`),
  timeSlots: endpoint(`${MODULES.booking}/time-slots`),
  bookingSettings: endpoint(`${MODULES.booking}/bookings/settings`),
  //Masterdata
  stores: endpoint(`${MODULES.masterdata}/stores`),
  brands: endpoint(`${MODULES.masterdata}/concepts`),
  pictures: endpoint(`${MODULES.masterdata}/pictures`),
} as const satisfies Record<string, EndpointDefinition>;
