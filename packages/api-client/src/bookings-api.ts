import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { BookingSource, BookingStatus, type Booking } from "./types";
import { bookingListSchema, bookingSchema } from "./schemas/booking";

export interface BookingQueryParams {
  keyword?: string;
  storeIds: number[];
  status?: BookingStatus[];
  startDate?: string;
  endDate?: string;
  offset?: number;
  limit?: number;
  orderBy?: string;
}

export interface BookingListResult {
  totalCount: number;
  records: Booking[];
}

function toApiParams(params: BookingQueryParams) {
  return {
    search: params.keyword,
    storeIds: params.storeIds,
    status: params.status,
    startDate: params.startDate,
    endDate: params.endDate,
    offset: params.offset,
    limit: params.limit,
    orderBy: params.orderBy,
  };
}

export interface CreateBookingPayload {
  organizationId: number;
  storeId: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestCount: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  source: BookingSource;
  note?: string;
  tableIds?: number[];
  overrideCapacity?: boolean;
}

export type UpdateBookingBasicInfoPayload = Partial<
  Pick<
    CreateBookingPayload,
    "customerName" | "customerPhone" | "customerEmail" | "startTime" | "endTime" | "note"
  >
>;

class BookingsApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.bookings);
  }

  async list(params: BookingQueryParams): Promise<BookingListResult> {
    return this.get<BookingListResult>("", toApiParams(params), { validator: bookingListSchema });
  }

  getOne(id: number): Promise<Booking> {
    return this.get<Booking>(`/${id}`, undefined, { validator: bookingSchema });
  }

  create(data: CreateBookingPayload): Promise<Booking> {
    return this.post<Booking>("", data, { validator: bookingSchema });
  }

  updateBasicInfo(id: number, patch: UpdateBookingBasicInfoPayload): Promise<Booking> {
    return this.put<Booking>("", { id, ...patch }, { validator: bookingSchema });
  }

  confirm(id: number): Promise<Booking> {
    return this.post<Booking>(`/${id}/confirm`, undefined, { validator: bookingSchema });
  }

  checkIn(id: number): Promise<Booking> {
    return this.post<Booking>(`/${id}/check-in`, undefined, { validator: bookingSchema });
  }

  assignTable(id: number, tableIds: number[]): Promise<Booking> {
    return this.post<Booking>(`/${id}/assign-table`, { tableIds }, { validator: bookingSchema });
  }

  cancel(id: number, cancelReason?: string): Promise<Booking> {
    return this.post<Booking>(`/${id}/cancel`, { cancelReason }, { validator: bookingSchema });
  }

  markNoShow(id: number): Promise<Booking> {
    return this.post<Booking>(`/${id}/no-show`, undefined, { validator: bookingSchema });
  }

  changeStatus(id: number, status: BookingStatus, note?: string): Promise<Booking> {
    return this.post<Booking>(`/${id}/status`, { status, note }, { validator: bookingSchema });
  }
}

export const bookingsApi = new BookingsApi();
