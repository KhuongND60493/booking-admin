import type { TFunction } from "i18next";
import { X } from "lucide-react";
import { ALL_BOOKING_DAYS_OF_WEEK, BOOKING_DAY_OF_WEEK_I18N_KEY } from "@skybooking/api-client";
import { BookingFacetedFilter } from "../../bookings/components/BookingFacetedFilter";

export const ALL_DAYS_FILTER_VALUE = 0;

export interface TimeSlotFilterBarProps {
  storeOptions: { value: number; label: string }[];
  storeIds: number[];
  onStoreIdsChange: (storeIds: number[]) => void;
  isActiveValues: ("active" | "inactive")[];
  onIsActiveValuesChange: (values: ("active" | "inactive")[]) => void;
  daysOfWeek: number[];
  onDaysOfWeekChange: (days: number[]) => void;
  t: TFunction;
}

export function TimeSlotFilterBar({
  storeOptions,
  storeIds,
  onStoreIdsChange,
  isActiveValues,
  onIsActiveValuesChange,
  daysOfWeek,
  onDaysOfWeekChange,
  t,
}: TimeSlotFilterBarProps) {
  const statusOptions: { value: "active" | "inactive"; label: string }[] = [
    { value: "active", label: t("status.active") },
    { value: "inactive", label: t("status.inactive") },
  ];

  const dayOptions = [
    { value: ALL_DAYS_FILTER_VALUE, label: t("filter.allDaysOfWeek") },
    ...ALL_BOOKING_DAYS_OF_WEEK.map((day) => ({
      value: day,
      label: t(`dayOfWeek.${BOOKING_DAY_OF_WEEK_I18N_KEY[day]}`),
    })),
  ];

  const isAllDaysSelected = ALL_BOOKING_DAYS_OF_WEEK.every((day) => daysOfWeek.includes(day));
  const daySelection = isAllDaysSelected ? [ALL_DAYS_FILTER_VALUE, ...daysOfWeek] : daysOfWeek;

  const handleDaysOfWeekChange = (next: number[]) => {
    const hasAll = next.includes(ALL_DAYS_FILTER_VALUE);
    if (hasAll && !isAllDaysSelected) {
      onDaysOfWeekChange([...ALL_BOOKING_DAYS_OF_WEEK]);
    } else if (!hasAll && isAllDaysSelected) {
      onDaysOfWeekChange([]);
    } else {
      onDaysOfWeekChange(next.filter((day) => day !== ALL_DAYS_FILTER_VALUE));
    }
  };

  const selectedCountLabel = (count: number) => t("filter.selectedCount", { count });

  const hasActiveFilters =
    storeIds.length > 0 || isActiveValues.length > 0 || daysOfWeek.length > 0;

  const handleReset = () => {
    onStoreIdsChange([]);
    onIsActiveValuesChange([]);
    onDaysOfWeekChange([]);
  };

  return (
    <>
      <BookingFacetedFilter
        label={t("filter.store")}
        options={storeOptions}
        selected={storeIds}
        onChange={onStoreIdsChange}
        selectedCountLabel={selectedCountLabel}
        clearLabel={t("filter.clear")}
        emptyLabel={t("filter.noResults")}
        popoverWidth={320}
      />
      <BookingFacetedFilter
        label={t("filter.status")}
        options={statusOptions}
        selected={isActiveValues}
        onChange={onIsActiveValuesChange}
        selectedCountLabel={selectedCountLabel}
        clearLabel={t("filter.clear")}
        emptyLabel={t("filter.noResults")}
        showSearch={false}
      />
      <BookingFacetedFilter
        label={t("filter.dayOfWeek")}
        options={dayOptions}
        selected={daySelection}
        onChange={handleDaysOfWeekChange}
        selectedCountLabel={selectedCountLabel}
        clearLabel={t("filter.clear")}
        emptyLabel={t("filter.noResults")}
        showSearch={false}
        selectedLabelOverride={isAllDaysSelected ? t("filter.allDaysOfWeek") : undefined}
      />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex shrink-0 items-center gap-1.5 h-8 rounded-md px-3 text-sm font-medium text-admin-ink-soft hover:bg-admin-bg"
        >
          <X size={16} />
          {t("filter.resetAll")}
        </button>
      )}
    </>
  );
}
