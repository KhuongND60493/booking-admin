import dayjs, { type Dayjs } from "dayjs";

const API_TIME_FORMAT = "YYYY-MM-DDTHH:mm:ss[Z]";

export function encodeApiTime(value: Dayjs): string {
  return value.second(0).millisecond(0).format(API_TIME_FORMAT);
}

export function decodeApiTime(value: string): Dayjs {
  return dayjs(value, API_TIME_FORMAT);
}

export function formatApiTimeForDisplay(value: string): string {
  const parsed = decodeApiTime(value);
  return parsed.isValid() ? parsed.format("HH:mm") : value;
}
