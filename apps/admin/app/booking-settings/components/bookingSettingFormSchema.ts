import { z } from "zod";

export const bookingSettingFormSchema = z.object({
  holdDurationMinutes: z.number().min(0),
  holdDurationMinutes_OverrideForStore: z.boolean(),
  gracePeriodMinutes: z.number().min(0),
  gracePeriodMinutes_OverrideForStore: z.boolean(),
  maxGuestPerTable: z.number().min(0),
  maxGuestPerTable_OverrideForStore: z.boolean(),
});

export type BookingSettingFormValues = z.infer<typeof bookingSettingFormSchema>;
