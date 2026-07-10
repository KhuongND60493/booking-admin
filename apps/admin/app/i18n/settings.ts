export const fallbackLng = "vi";
export const languages = [fallbackLng, "en"] as const;
export type AppLanguage = (typeof languages)[number];

export const defaultNS = "common";
export const namespaces = ["common", "sidebar", "bookings", "waitlist"] as const;
export type AppNamespace = (typeof namespaces)[number];

export const i18nCookieName = "i18next";

export function getOptions(
  lng: string = fallbackLng,
  ns: string | string[] = defaultNS,
) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
