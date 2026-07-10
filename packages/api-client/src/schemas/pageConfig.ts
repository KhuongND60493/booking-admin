import { z } from "zod";
import type { PageKey } from "../types";

export const pageConfigComponentSchema = z.object({
  type: z.string(),
  props: z.record(z.unknown()),
});

const PAGE_KEY_TUPLE = [
  "home",
  "storeDetail",
  "tableSelection",
  "customerInfo",
  "otp",
  "success",
  "waitlist",
] as const satisfies readonly PageKey[];

export const pageConfigDataSchema = z.object({
  storeId: z.string(),
  page: z.enum(PAGE_KEY_TUPLE),
  components: z.array(pageConfigComponentSchema),
});
