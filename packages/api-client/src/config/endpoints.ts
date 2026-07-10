import { ServiceName } from "./serviceRegistry";

export interface EndpointDefinition {
  service: ServiceName;
  base: string;
}

export const ENDPOINTS = {
  bookings: { service: ServiceName.Default, base: "/order-v2/bookings" },
  stores: { service: ServiceName.Default, base: "/masterdata/api/stores" },
  brands: { service: ServiceName.Default, base: "/masterdata/api/concepts" },
  pictures: { service: ServiceName.Default, base: "/masterdata/api/pictures" },
  otp: { service: ServiceName.Default, base: "/otp" },
  waitlist: { service: ServiceName.Default, base: "/waitlist" },
  menu: { service: ServiceName.Default, base: "/menu" },
  tables: { service: ServiceName.Default, base: "/search-tables" },
} as const satisfies Record<string, EndpointDefinition>;
