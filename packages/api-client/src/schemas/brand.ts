import { z } from "zod";

export const brandSchema = z.object({
  id: z.number(),
  organizationId: z.number(),
  name: z.string(),
  code: z.string(),
  status: z.number(),
  guidString: z.string(),
});

export const brandListResultSchema = z.object({
  totalCount: z.number(),
  records: z.array(brandSchema),
});
