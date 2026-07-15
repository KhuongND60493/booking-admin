import { BaseApi } from "./http/baseApi";
import { ENDPOINTS } from "./config/endpoints";
import { DEFAULT_ORGANIZATION_ID } from "./config/organization";
import type { BookingSetting } from "./types";
import { bookingSettingSchema } from "./schemas/bookingSetting";

export interface BookingSettingParams {
  orgId?: number;
  storeId?: number;
  [key: string]: unknown;
}

class BookingSettingsApi extends BaseApi {
  constructor() {
    super(ENDPOINTS.bookingSettings);
  }

  getSetting(params: BookingSettingParams): Promise<BookingSetting> {
    const { orgId, ...rest } = params;
    return this.get<BookingSetting>(
      "",
      { ...rest, orgId: orgId ?? DEFAULT_ORGANIZATION_ID },
      { validator: bookingSettingSchema }
    );
  }

  update(params: BookingSettingParams, data: BookingSetting): Promise<BookingSetting> {
    const { orgId, ...rest } = params;
    return this.post<BookingSetting>("", data, {
      validator: bookingSettingSchema,
      params: { ...rest, orgId: orgId ?? DEFAULT_ORGANIZATION_ID },
    });
  }
}

export const bookingSettingsApi = new BookingSettingsApi();
