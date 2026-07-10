import { z } from "zod";

export const storeThemeColorsSchema = z.object({
  primary: z.string(),
  background: z.string(),
  text: z.string(),
  textMuted: z.string(),
});

export const storeThemeFontsSchema = z.object({
  heading: z.string(),
  body: z.string(),
});

export const storeThemeSchema = z.object({
  storeId: z.string(),
  colors: storeThemeColorsSchema,
  fonts: storeThemeFontsSchema,
});
