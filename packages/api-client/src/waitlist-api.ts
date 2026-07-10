import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import type { Booking, WaitlistEntry } from "./types";
import { bookingSchema } from "./schemas/booking";
import { waitlistEntrySchema, waitlistEntryListSchema } from "./schemas/waitlistEntry";

class WaitlistApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.waitlist);
  }

  listByStore(storeId: string): Promise<WaitlistEntry[]> {
    return this.get<WaitlistEntry[]>("", { storeId }, { validator: waitlistEntryListSchema });
  }

  submit(data: Omit<WaitlistEntry, "id" | "createdAt" | "converted">): Promise<WaitlistEntry> {
    return this.post<WaitlistEntry>("", data, { validator: waitlistEntrySchema });
  }

  // NOTE: endpoint BE mới, cần BE xác nhận/triển khai trước khi dùng thật.
  // BE nhận id + tableIds, tự tra waitlist entry và tạo booking tương ứng.
  convert(id: string, tableIds: string[]): Promise<Booking> {
    return this.post<Booking>(`/${id}/convert`, { tableIds }, { validator: bookingSchema });
  }
}

export const waitlistApi = new WaitlistApi();
