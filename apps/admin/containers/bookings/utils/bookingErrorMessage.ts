import type { TFunction } from "i18next";
import { ApiError, BOOKING_ERROR_I18N_KEY } from "@skybooking/api-client";

export function bookingErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    const key = error.errorNumber != null ? BOOKING_ERROR_I18N_KEY[error.errorNumber] : undefined;
    if (key) return t(key);
    return error.message;
  }
  return error instanceof Error ? error.message : String(error);
}
