import { dictionaries, Locale } from './dictionaries'

function normalizeLocale(locale?: string): Locale {
  return locale === 'vi' ? 'vi' : 'en'
}

export function t(locale: string | undefined, key: string): string {
  const dict = dictionaries[normalizeLocale(locale)]
  return dict[key] ?? dictionaries.en[key] ?? key
}
