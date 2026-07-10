"use client";

import { Card, Tag } from "antd";
import type { TFunction } from "i18next";
import type { TableResult } from "@skybooking/api-client";

export interface BookingSummaryPanelProps {
  t: TFunction;
  brandLabel?: string;
  storeLabel?: string;
  date: string;
  time: string;
  partySize: number;
  zoneLabel?: string;
  selectedTables: TableResult[];
  totalCapacity: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  note: string;
  bookingCode?: string;
  createdAt?: string;
}

export function BookingSummaryPanel({
  t,
  brandLabel,
  storeLabel,
  date,
  time,
  partySize,
  selectedTables,
  totalCapacity,
  customerName,
  customerPhone,
  customerEmail,
  note,
  bookingCode,
  createdAt,
}: BookingSummaryPanelProps) {
  const isShortOnCapacity = selectedTables.length > 0 && totalCapacity < partySize;

  const row = (label: string, value: string | undefined) => (
    <div className="flex justify-between gap-3 text-xs py-1">
      <span className="text-admin-muted">{label}</span>
      <span className="text-admin-ink font-medium text-right">{value || "—"}</span>
    </div>
  );

  return (
    <Card title={t("new.section.summary")} size="small">
      <div className="divide-y divide-admin-border">
        <div className="pb-2">
          {bookingCode && row(t("detail.bookingCode"), bookingCode)}
          {createdAt && row(t("detail.createdAt"), createdAt)}
          {brandLabel && row(t("new.field.brand"), brandLabel)}
          {row(t("new.field.store"), storeLabel)}
          {row(t("new.field.date"), date)}
          {row(t("new.field.timeSlot"), time)}
          {row(t("new.field.partySize"), String(partySize))}
        </div>
        <div className="py-2">
          {row(
            t("new.field.tables"),
            selectedTables.length ? selectedTables.map((t2) => t2.name).join(", ") : undefined
          )}
          {isShortOnCapacity && (
            <Tag color="warning" className="mt-1">
              {t("new.field.notEnoughCapacity", { total: totalCapacity, needed: partySize })}
            </Tag>
          )}
        </div>
        <div className="pt-2">
          {row(t("new.field.fullName"), customerName)}
          {row(t("new.field.phone"), customerPhone)}
          {row(t("new.field.email"), customerEmail)}
          {row(t("new.field.note"), note)}
        </div>
      </div>
    </Card>
  );
}
