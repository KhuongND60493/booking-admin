import type { TFunction } from "i18next";
import { KpiCard } from "./KpiCard";

export interface BookingKpi {
  total: number;
  confirmed: number;
  cancelled: number;
}

export interface BookingKpiRowProps {
  kpi: BookingKpi;
  t: TFunction;
  waitlist?: number | string;
}

export function BookingKpiRow({ kpi, t, waitlist = "—" }: BookingKpiRowProps) {
  return (
    <div className="grid grid-cols-4 gap-3.5 mb-6">
      <KpiCard label={t("kpi.total")} value={kpi.total} />
      <KpiCard label={t("kpi.confirmed")} value={kpi.confirmed} tone="success" />
      <KpiCard label={t("kpi.cancelled")} value={kpi.cancelled} tone="danger" />
      <KpiCard label={t("kpi.waitlist")} value={waitlist} tone="warning" />
    </div>
  );
}
