"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "../i18n/client";
import { LanguageSwitcher } from "../i18n/LanguageSwitcher";

const MENUS = [
  { href: "/bookings", labelKey: "menu.bookings" },
  { href: "/waitlist", labelKey: "menu.waitlist" },
  { href: "/booking-time-slots", labelKey: "menu.bookingTimeSlots" },
  { href: "/booking-tables", labelKey: "menu.bookingTables" },
  { href: "/edit-layout", labelKey: "menu.editLayout" },
  { href: "/booking-settings", labelKey: "menu.bookingSettings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation("sidebar");

  return (
    <div className="w-60 bg-gray-900 flex flex-col flex-shrink-0 border-r border-gray-800">
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="text-amber-400 font-semibold text-sm">SkyBooking</div>
        <div className="text-gray-500 text-[10px] tracking-wide">
          {t("brandSubtitle")}
        </div>
      </div>
      <nav className="flex-1 p-2.5 flex flex-col gap-1">
        {MENUS.map((m) => {
          const active = pathname === m.href || pathname?.startsWith(m.href + "/");
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`px-3 py-2 rounded-md text-xs font-medium ${
                active ? "bg-amber-400/10 text-amber-400" : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              {t(m.labelKey)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-2.5 border-t border-gray-800">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
