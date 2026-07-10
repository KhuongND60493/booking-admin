import { z } from "zod";

export const menuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  category: z.string(),
});

export const menuItemListSchema = z.array(menuItemSchema);
