import { z } from "zod";

export const waitlistEntrySchema = z.object({
  id: z.string(),
  storeId: z.string(),
  customer: z.object({
    name: z.string(),
    phone: z.string(),
  }),
  partySize: z.number(),
  preferredTime: z.string(),
  createdAt: z.string(),
  converted: z.boolean(),
});

export const waitlistEntryListSchema = z.array(waitlistEntrySchema);
