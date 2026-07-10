import { z } from "zod";

export const tableResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number(),
  available: z.boolean(),
  location: z.string(),
  zone: z.string(),
});

export const tableResultListSchema = z.array(tableResultSchema);
