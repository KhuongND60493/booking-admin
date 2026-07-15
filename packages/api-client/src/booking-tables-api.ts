import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { DEFAULT_ORGANIZATION_ID } from "./config/organization";
import type { BookingTableRow } from "./types";
import { bookingTableRowSchema, bookingTableRowListSchema } from "./schemas/bookingTable";

export interface BookingTableListParams {
  orgId?: number;
  storeIds?: number[];
  isActive?: boolean;
  [key: string]: unknown;
}

export type CreateBookingTablePayload = Omit<BookingTableRow, "id">;
export type UpdateBookingTablePayload = BookingTableRow;

class BookingTablesApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.tables);
  }

  list(params: BookingTableListParams): Promise<BookingTableRow[]> {
    const { storeIds, orgId, ...rest } = params;
    return this.get<BookingTableRow[]>(
      "",
      { ...rest, storeIds, orgId: orgId ?? DEFAULT_ORGANIZATION_ID },
      { validator: bookingTableRowListSchema }
    );
  }

  create(data: CreateBookingTablePayload): Promise<BookingTableRow> {
    return this.post<BookingTableRow>("", data, { validator: bookingTableRowSchema });
  }

  update(data: UpdateBookingTablePayload): Promise<BookingTableRow> {
    return this.put<BookingTableRow>("", data, { validator: bookingTableRowSchema });
  }

  deleteOne(id: number): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const bookingTablesApi = new BookingTablesApi();
