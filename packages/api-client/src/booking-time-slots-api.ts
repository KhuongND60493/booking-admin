import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { DEFAULT_ORGANIZATION_ID } from "./config/organization";
import type { BookingTimeSlot } from "./types";
import { bookingTimeSlotSchema, bookingTimeSlotListSchema } from "./schemas/bookingTimeSlot";

export interface BookingTimeSlotListParams {
  orgId?: number;
  storeIds?: number[];
  isActive?: boolean;
  dayOfWeek?: number;
  [key: string]: unknown;
}

class BookingTimeSlotsApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.timeSlots);
  }

  list(params: BookingTimeSlotListParams): Promise<BookingTimeSlot[]> {
    const { storeIds, orgId, ...rest } = params;
    return this.get<BookingTimeSlot[]>(
      "",
      { ...rest, storeIds, orgId: orgId ?? DEFAULT_ORGANIZATION_ID },
      { validator: bookingTimeSlotListSchema }
    );
  }

  getOne(id: number): Promise<BookingTimeSlot> {
    return this.get<BookingTimeSlot>(`/${id}`, undefined, { validator: bookingTimeSlotSchema });
  }

  create(data: Omit<BookingTimeSlot, "id">): Promise<BookingTimeSlot> {
    return this.post<BookingTimeSlot>("", data, { validator: bookingTimeSlotSchema });
  }

  update(data: BookingTimeSlot): Promise<BookingTimeSlot> {
    return this.put<BookingTimeSlot>("", data, { validator: bookingTimeSlotSchema });
  }

  deleteOne(id: number): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const bookingTimeSlotsApi = new BookingTimeSlotsApi();
