import { z } from "zod";

export const bookingSettingSchema = z.object({
  holdDurationMinutes: z.number(),
  holdDurationMinutes_OverrideForStore: z.boolean(),
  gracePeriodMinutes: z.number(),
  gracePeriodMinutes_OverrideForStore: z.boolean(),
  maxGuestPerTable: z.number(),
  maxGuestPerTable_OverrideForStore: z.boolean(),
});
