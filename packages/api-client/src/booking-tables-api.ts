import { z } from "zod";
import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import type { BookingTable } from "./types";
import { bookingTableSchema } from "./schemas/booking";

const bookingTableListSchema = z.array(bookingTableSchema);

export interface BookingTableListParams {
  storeId: number;
  isActive?: boolean;
}

class BookingTablesApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.bookings);
  }

  list(params: BookingTableListParams): Promise<BookingTable[]> {
    return this.get<BookingTable[]>(
      "/tables",
      { storeId: params.storeId, isActive: params.isActive },
      { validator: bookingTableListSchema }
    );
  }
}

export const bookingTablesApi = new BookingTablesApi();
