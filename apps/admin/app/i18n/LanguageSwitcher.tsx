"use client";

import { useCookies } from "react-cookie";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "./client";
import { i18nCookieName, languages, type AppLanguage } from "./settings";

const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [, setCookie] = useCookies([i18nCookieName]);

  const current = (i18n.resolvedLanguage as AppLanguage) ?? languages[0];

  const changeLanguage = (lng: AppLanguage) => {
    setCookie(i18nCookieName, lng, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    void i18n.changeLanguage(lng);
  };

  const items: MenuProps["items"] = languages.map((lng) => ({
    key: lng,
    label: LANGUAGE_LABELS[lng],
    onClick: () => changeLanguage(lng),
  }));

  return (
    <Dropdown
      menu={{ items, selectedKeys: [current] }}
      trigger={["click"]}
      placement="topLeft"
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-xs font-medium text-gray-400 hover:bg-gray-800"
      >
        <span className="flex items-center gap-2">
          <GlobeIcon />
          {LANGUAGE_LABELS[current]}
        </span>
        <ChevronIcon />
      </button>
    </Dropdown>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
