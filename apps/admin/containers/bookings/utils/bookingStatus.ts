import type { TFunction } from "i18next";
import { BOOKING_STATUS_I18N_KEY, BookingStatus } from "@skybooking/api-client";

export type StatusTone = "success" | "warning" | "danger" | "muted" | "info";

const STATUS_TONE: Record<BookingStatus, StatusTone> = {
  [BookingStatus.Draft]: "muted",
  [BookingStatus.Pending]: "warning",
  [BookingStatus.Confirmed]: "info",
  [BookingStatus.CheckedIn]: "info",
  [BookingStatus.Seated]: "info",
  [BookingStatus.Completed]: "success",
  [BookingStatus.Cancelled]: "danger",
  [BookingStatus.NoShow]: "danger",
  [BookingStatus.Expired]: "muted",
};

const TONE_TAG_COLOR: Record<StatusTone, string> = {
  success: "green",
  warning: "gold",
  danger: "red",
  muted: "default",
  info: "blue",
};

export interface BookingStatusMeta {
  label: string;
  tone: StatusTone;
  tagColor: string;
}

export function bookingStatusMeta(
  status: BookingStatus,
  t: TFunction,
): BookingStatusMeta {
  const tone = STATUS_TONE[status] ?? "muted";
  const i18nKey = BOOKING_STATUS_I18N_KEY[status];
  return {
    label: t(`status.${i18nKey}`, { defaultValue: i18nKey }),
    tone,
    tagColor: TONE_TAG_COLOR[tone],
  };
}
