import { z } from "zod";

export const bookingTableRowSchema = z.object({
  id: z.number(),
  organizationId: z.number(),
  storeId: z.number(),
  refId: z.number().nullish(),
  tableCode: z.string().nullish(),
  tableName: z.string().nullish(),
  areaId: z.number(),
  capacity: z.number().nullish(),
  minCapacity: z.number().nullish(),
  maxCapacity: z.number(),
  isActive: z.boolean(),
});

export const bookingTableRowListSchema = z.array(bookingTableRowSchema);
