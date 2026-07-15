import type { SettingItem } from "./settingFieldTypes";
import type { BookingSettingFormValues } from "./bookingSettingFormSchema";

export const BOOKING_SETTING_FIELDS: SettingItem<BookingSettingFormValues>[] = [
  {
    kind: "field",
    type: "number",
    name: "holdDurationMinutes",
    labelKey: "field.holdDurationMinutes",
    suffixKey: "unit.minutes",
    min: 0,
  },
  {
    kind: "field",
    type: "number",
    name: "gracePeriodMinutes",
    labelKey: "field.gracePeriodMinutes",
    suffixKey: "unit.minutes",
    min: 0,
  },
  {
    kind: "field",
    type: "number",
    name: "maxGuestPerTable",
    labelKey: "field.maxGuestPerTable",
    suffixKey: "unit.guests",
    min: 0,
  },
];
