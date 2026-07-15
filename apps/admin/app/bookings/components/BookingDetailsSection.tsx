"use client";

import dayjs from "dayjs";
import { Card, DatePicker, InputNumber, Select, Tooltip } from "antd";
import { CalendarSearch } from "lucide-react";
import type { TFunction } from "i18next";
import type { TableResult } from "@skybooking/api-client";

export interface BookingDetailsSectionProps {
  t: TFunction;
  readOnly?: boolean;
  brandOptions: { value: number; label: string }[];
  brandId: number | null;
  onBrandIdChange: (brandId: number | null) => void;
  storeOptions: { value: string; label: string }[];
  storeId: string | null;
  onStoreIdChange: (storeId: string | null) => void;
  date: string;
  onDateChange: (date: string) => void;
  timeSlots: string[];
  time: string;
  onTimeChange: (time: string) => void;
  partySize: number;
  onPartySizeChange: (partySize: number) => void;
  zones: string[];
  zone: string | null;
  onZoneChange: (zone: string | null) => void;
  tables: TableResult[];
  selectedTableIds: string[];
  onToggleTable: (id: string) => void;
}

export function BookingDetailsSection({
  t,
  readOnly,
  brandOptions,
  brandId,
  onBrandIdChange,
  storeOptions,
  storeId,
  onStoreIdChange,
  date,
  onDateChange,
  timeSlots,
  time,
  onTimeChange,
  partySize,
  onPartySizeChange,
  zones,
  zone,
  onZoneChange,
  tables,
  selectedTableIds,
  onToggleTable,
}: BookingDetailsSectionProps) {
  const canBrowseTables = !!(storeId && date && time && partySize > 0);

  return (
    <Card title={t("new.section.bookingInfo")}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3.5 gap-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.brand")}
            </label>
            <Select
              value={brandId ?? undefined}
              onChange={onBrandIdChange}
              options={brandOptions}
              disabled={readOnly}
              style={{ width: "100%" }}
              allowClear
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.store")}
            </label>
            <Select
              value={storeId ?? undefined}
              onChange={onStoreIdChange}
              options={storeOptions}
              disabled={readOnly}
              style={{ width: "100%" }}
              placeholder={t("new.field.store")}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.date")}
            </label>
            <DatePicker
              value={date ? dayjs(date) : null}
              onChange={(d) => onDateChange(d ? d.format("YYYY-MM-DD") : "")}
              format="DD/MM/YYYY"
              disabledDate={(cur) => !!cur && cur < dayjs().startOf("day")}
              disabled={readOnly}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.partySize")}
            </label>
            <InputNumber
              min={1}
              value={partySize}
              onChange={(v) => onPartySizeChange(v ?? 1)}
              disabled={readOnly}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-1.5">
              {t("new.field.timeSlot")}
            </label>
            <Select
              value={time || undefined}
              onChange={onTimeChange}
              options={timeSlots.map((slot) => ({ value: slot, label: slot }))}
              disabled={readOnly || !date}
              style={{ width: "100%" }}
              notFoundContent={t("new.field.noTimeSlot")}
            />
          </div>
        </div>

        {canBrowseTables ? (
          <div className="pt-1 border-t border-admin-border">
            <div className="pt-4">
              <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-2">
                {t("new.field.zone")}
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => onZoneChange(null)}
                  disabled={readOnly}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    zone === null
                      ? "border-amber-400 bg-amber-50 text-admin-ink"
                      : "border-admin-border text-admin-ink-soft"
                  }`}
                >
                  {t("new.field.allZones")}
                </button>
                {zones.map((z) => (
                  <button
                    type="button"
                    key={z}
                    onClick={() => onZoneChange(z)}
                    disabled={readOnly}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      zone === z
                        ? "border-amber-400 bg-amber-50 text-admin-ink"
                        : "border-admin-border text-admin-ink-soft"
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>

              <label className="block text-[10px] font-semibold text-admin-muted uppercase mb-2">
                {t("new.field.tables")}
              </label>
              {tables.length === 0 ? (
                <p className="text-xs text-admin-muted">{t("new.field.noTables")}</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {tables.map((tbl) => {
                    const isSelected = selectedTableIds.includes(tbl.id);
                    const card = (
                      <Card
                        key={tbl.id}
                        size="small"
                        hoverable={tbl.available && !readOnly}
                        onClick={() => tbl.available && !readOnly && onToggleTable(tbl.id)}
                        className={!tbl.available ? "opacity-50 cursor-not-allowed" : undefined}
                        style={
                          isSelected
                            ? { borderColor: "#fbbf24", backgroundColor: "#fffbeb" }
                            : !tbl.available
                              ? { backgroundColor: "#f3f4f6" }
                              : undefined
                        }
                      >
                        <div className="text-xs font-bold text-admin-ink">{tbl.name}</div>
                        <div className="text-[10px] text-admin-muted">
                          {t("new.seats", { count: tbl.capacity })}
                        </div>
                      </Card>
                    );
                    return tbl.available ? (
                      card
                    ) : (
                      <Tooltip key={tbl.id} title={t("new.field.tableLocked")}>
                        {card}
                      </Tooltip>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="pt-5 border-t border-admin-border flex flex-col items-center text-center gap-2 py-6">
            <CalendarSearch size={22} className="text-admin-muted" />
            <p className="text-xs text-admin-muted max-w-xs">{t("new.field.selectToBrowseTables")}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
