"use client";

import { useEffect, useState } from "react";
import i18next, {
  type FlatNamespace,
  type KeyPrefix,
} from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useCookies } from "react-cookie";
import {
  initReactI18next,
  useTranslation as useTranslationOrg,
  type FallbackNs,
  type UseTranslationOptions,
} from "react-i18next";

import { useI18nContext } from "./I18nProvider";
import { getOptions, i18nCookieName, languages } from "./settings";

const runsOnServerSide = typeof window === "undefined";

void i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../public/locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: { order: ["cookie", "htmlTag", "navigator"] },
    preload: runsOnServerSide ? languages : [],
  });

export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined,
>(ns?: Ns, options?: UseTranslationOptions<KPrefix>) {
  const { lng } = useI18nContext();
  const [cookies] = useCookies([i18nCookieName]);
  const ret = useTranslationOrg(ns, options);
  const { i18n } = ret;

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }

  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return;
    setActiveLng(i18n.resolvedLanguage);
  }, [activeLng, i18n.resolvedLanguage]);

  useEffect(() => {
    const cookieLng = cookies[i18nCookieName];
    if (cookieLng && i18n.resolvedLanguage !== cookieLng) {
      i18n.changeLanguage(cookieLng);
    }
  }, [cookies, i18n]);

  return ret;
}
