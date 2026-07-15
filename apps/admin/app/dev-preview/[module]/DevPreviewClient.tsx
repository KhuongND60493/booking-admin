"use client";

import { useSearchParams } from "next/navigation";

import type { PropsRemotePageDefault } from "@/containers/types";
import BookingListPage from "@/containers/bookings/index";
import CreateBookingPage from "@/containers/bookings/new";
import { WaitlistPage } from "@/containers/waitlist/index";
import TimeSlotsPage from "@/containers/time-slots/index";
import TablesPage from "@/containers/tables/index";
import EditLayoutIndexPage from "@/containers/layout/index";
import SettingsPage from "@/containers/settings/index";

export const MODULES: Record<string, React.ComponentType<PropsRemotePageDefault>> = {
  bookings: BookingListPage,
  "bookings-new": CreateBookingPage,
  waitlist: WaitlistPage,
  "time-slots": TimeSlotsPage,
  tables: TablesPage,
  layout: EditLayoutIndexPage,
  settings: SettingsPage,
};

const DEFAULT_PERMISSIONS = ["bo-view-bookings", "bo-create-bookings", "bo-edit-bookings"];

export default function DevPreviewClient({ module }: { module: string }) {
  const searchParams = useSearchParams();
  const Module = MODULES[module];

  if (!Module) {
    return (
      <div className="p-6">
        <p className="mb-2 font-semibold">Không tìm thấy module &quot;{module}&quot;.</p>
        <p className="text-sm text-admin-ink/60">Các module hợp lệ: {Object.keys(MODULES).join(", ")}</p>
      </div>
    );
  }

  const tenantId = searchParams.get("tenantId") ?? "tenant-demo-01";
  const locale = searchParams.get("locale") ?? "vi";
  const parentPage = Number(searchParams.get("parentPage") ?? "1");
  const permissions = searchParams.get("permissions")?.split(",").filter(Boolean) ?? DEFAULT_PERMISSIONS;

  return <Module tenantId={tenantId} locale={locale} parentPage={parentPage} permissions={permissions} />;
}
