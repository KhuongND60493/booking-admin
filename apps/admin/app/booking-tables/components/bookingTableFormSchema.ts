import { z } from "zod";

export const bookingTableFormSchema = z
  .object({
    storeId: z.number().min(1, "required"),
    refId: z.number().int().nullable(),
    tableCode: z.string().trim().min(1, "required"),
    tableName: z.string().trim().min(1, "required"),
    areaId: z.number().int().min(0),
    capacity: z.number().int().min(1, "required"),
    minCapacity: z.number().int().min(1, "required"),
    maxCapacity: z.number().int().min(1, "required"),
    isActive: z.boolean(),
  })
  .refine((data) => data.minCapacity <= data.maxCapacity, {
    message: "minMaxCapacity",
    path: ["minCapacity"],
  });

export type BookingTableFormValues = z.infer<typeof bookingTableFormSchema>;
