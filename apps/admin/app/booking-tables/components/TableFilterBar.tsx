import type { TFunction } from "i18next";
import { X } from "lucide-react";
import { BookingFacetedFilter } from "../../bookings/components/BookingFacetedFilter";

export interface TableFilterBarProps {
  storeOptions: { value: number; label: string }[];
  storeIds: number[];
  onStoreIdsChange: (storeIds: number[]) => void;
  isActiveValues: ("active" | "inactive")[];
  onIsActiveValuesChange: (values: ("active" | "inactive")[]) => void;
  t: TFunction;
}

export function TableFilterBar({
  storeOptions,
  storeIds,
  onStoreIdsChange,
  isActiveValues,
  onIsActiveValuesChange,
  t,
}: TableFilterBarProps) {
  const statusOptions: { value: "active" | "inactive"; label: string }[] = [
    { value: "active", label: t("status.active") },
    { value: "inactive", label: t("status.inactive") },
  ];

  const selectedCountLabel = (count: number) => t("filter.selectedCount", { count });

  const hasActiveFilters = storeIds.length > 0 || isActiveValues.length > 0;

  const handleReset = () => {
    onStoreIdsChange([]);
    onIsActiveValuesChange([]);
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
        emptySelectionBadge={t("filter.allStores")}
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
