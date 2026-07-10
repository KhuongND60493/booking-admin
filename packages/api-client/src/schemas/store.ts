import { z } from "zod";
import { StoreStatus } from "../types";

export const storeSchema = z.object({
  id: z.number(),
  organizationId: z.number().optional(),
  name: z.string(),
  code: z.number().optional(),
  status: z.nativeEnum(StoreStatus),
  conceptId: z.number().optional(),
  conceptName: z.string().optional(),
  address: z.string().nullish(),
  phone: z.string().nullish(),
  website: z.string().nullish(),
  description: z.string().nullish(),
  openTime: z.string().nullish(),
  closeTime: z.string().nullish(),
  bannerId: z.number().optional(),
  bannerUrl: z.string().nullish(),
  photoId: z.number().optional(),
  photoUrl: z.string().nullish(),
  guidString: z.string(),
});

export const storeListResultSchema = z.object({
  totalCount: z.number(),
  records: z.array(storeSchema),
});
