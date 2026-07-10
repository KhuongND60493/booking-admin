import dayjs from "dayjs";
import { DatePicker } from "antd";
import type { TimeRangePickerProps } from "antd";
import { X } from "lucide-react";
import type { TFunction } from "i18next";
import { ALL_BOOKING_STATUSES, BOOKING_STATUS_I18N_KEY, BookingStatus } from "@skybooking/api-client";
import type { BookingListFilters } from "@skybooking/hooks";
import { BookingFilterSearchToggle } from "./BookingFilterSearchToggle";
import { BookingFacetedFilter } from "./BookingFacetedFilter";

const { RangePicker } = DatePicker;

export interface BookingFilterBarProps {
  filters: BookingListFilters;
  brandOptions: { value: number; label: string }[];
  storeOptions: { value: number; label: string }[];
  onKeywordChange: (keyword: string) => void;
  onPeriodChange: (dateFrom: string, dateTo: string) => void;
  onBrandIdsChange: (brandIds: number[]) => void;
  onStoreIdsChange: (storeIds: number[]) => void;
  onStatusesChange: (statuses: BookingStatus[]) => void;
  t: TFunction;
}

export function BookingFilterBar({
  filters,
  brandOptions,
  storeOptions,
  onKeywordChange,
  onPeriodChange,
  onBrandIdsChange,
  onStoreIdsChange,
  onStatusesChange,
  t,
}: BookingFilterBarProps) {
  const statusOptions: { value: BookingStatus; label: string }[] = ALL_BOOKING_STATUSES.map(
    (status) => ({ value: status, label: t(`status.${BOOKING_STATUS_I18N_KEY[status]}`) })
  );

  const periodPresets: TimeRangePickerProps["presets"] = [
    { label: t("filter.period.today"), value: [dayjs().startOf("day"), dayjs().endOf("day")] },
    { label: t("filter.period.thisWeek"), value: [dayjs().startOf("week"), dayjs().endOf("week")] },
    { label: t("filter.period.thisMonth"), value: [dayjs().startOf("month"), dayjs().endOf("month")] },
    { label: t("filter.period.thisYear"), value: [dayjs().startOf("year"), dayjs().endOf("year")] },
  ];

  const handlePeriodChange: TimeRangePickerProps["onChange"] = (dates) => {
    if (!dates || !dates[0] || !dates[1]) {
      const today = dayjs().format("YYYY-MM-DD");
      onPeriodChange(today, today);
      return;
    }
    onPeriodChange(dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD"));
  };

  const selectedCountLabel = (count: number) => t("filter.selectedCount", { count });

  const hasActiveFacetedFilters =
    filters.brandIds.length > 0 || filters.storeIds.length > 0 || filters.statuses.length > 0;

  const handleResetFacetedFilters = () => {
    onBrandIdsChange([]);
    onStoreIdsChange([]);
    onStatusesChange([]);
  };

  return (
    <div className="mb-4 flex items-center gap-2 flex-wrap">
      <BookingFilterSearchToggle
        value={filters.keyword ?? ""}
        onChange={onKeywordChange}
        placeholder={t("filter.searchPlaceholder")}
      />
      <RangePicker
        value={[dayjs(filters.dateFrom), dayjs(filters.dateTo)]}
        onChange={handlePeriodChange}
        format="DD/MM/YYYY"
        presets={periodPresets}
        style={{ width: 240 }}
      />
      <BookingFacetedFilter
        label={t("filter.brands")}
        options={brandOptions}
        selected={filters.brandIds}
        onChange={onBrandIdsChange}
        selectedCountLabel={selectedCountLabel}
        clearLabel={t("filter.clear")}
        emptyLabel={t("filter.noResults")}
      />
      <BookingFacetedFilter
        label={t("filter.stores")}
        options={storeOptions}
        selected={filters.storeIds}
        onChange={onStoreIdsChange}
        selectedCountLabel={selectedCountLabel}
        clearLabel={t("filter.clear")}
        emptyLabel={t("filter.noResults")}
      />
      <BookingFacetedFilter
        label={t("filter.statuses")}
        options={statusOptions}
        selected={filters.statuses}
        onChange={(v) => onStatusesChange(v as BookingStatus[])}
        selectedCountLabel={selectedCountLabel}
        clearLabel={t("filter.clear")}
        emptyLabel={t("filter.noResults")}
      />
      {hasActiveFacetedFilters && (
        <button
          type="button"
          onClick={handleResetFacetedFilters}
          className="inline-flex shrink-0 items-center gap-1.5 h-8 rounded-md px-3 text-sm font-medium text-admin-ink-soft hover:bg-admin-bg"
        >
          <X size={16} />
          {t("filter.resetAll")}
        </button>
      )}
    </div>
  );
}
