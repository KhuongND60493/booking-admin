import { z } from "zod";
import type { Dayjs } from "dayjs";

export const timeSlotFormSchema = z
  .object({
    storeIds: z.array(z.number()),
    name: z.string().trim().min(1, "required"),
    startTime: z.custom<Dayjs>((val) => !!val, "required"),
    endTime: z.custom<Dayjs>((val) => !!val, "required"),
    daysOfWeek: z.array(z.number()).min(1, "required"),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean(),
  })
  .refine((data) => data.endTime.isAfter(data.startTime), {
    message: "endTimeAfterStartTime",
    path: ["endTime"],
  });

export type TimeSlotFormValues = z.infer<typeof timeSlotFormSchema>;
