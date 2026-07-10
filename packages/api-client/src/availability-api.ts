import { z } from "zod";
import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import type { BookingTable } from "./types";
import { bookingTableSchema } from "./schemas/booking";

export interface AvailabilityParams {
  organizationId: number;
  storeId: number;
  startTime: string;
  endTime: string;
  guestCount: number;
}

export interface AvailabilityResult {
  availableTables: BookingTable[];
  suggestedTables: BookingTable[];
}

const availabilityResultSchema = z.object({
  availableTables: z.array(bookingTableSchema),
  suggestedTables: z.array(bookingTableSchema),
});

class AvailabilityApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.bookings);
  }

  getAvailability(params: AvailabilityParams): Promise<AvailabilityResult> {
    return this.get<AvailabilityResult>("/availability", { ...params }, { validator: availabilityResultSchema });
  }
}

export const availabilityApi = new AvailabilityApi();
