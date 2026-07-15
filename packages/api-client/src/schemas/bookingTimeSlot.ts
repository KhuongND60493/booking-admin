import { z } from "zod";

export const bookingTimeSlotSchema = z.object({
  id: z.number(),
  organizationId: z.number(),
  storeIds: z.array(z.number()).nullable(),
  name: z.string().nullish(),
  startTime: z.string(),
  endTime: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().nullish(),
  daysOfWeek: z.number(),
});

export const bookingTimeSlotListSchema = z.array(bookingTimeSlotSchema);
