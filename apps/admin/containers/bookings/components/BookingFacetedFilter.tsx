"use client";

import { useState } from "react";
import { Popover } from "antd";
import { Check, CirclePlus, Search } from "lucide-react";
import { FilterTriggerButton } from "@/app/components/FilterTriggerButton";
import { FilterBadge } from "@/app/components/FilterBadge";

export interface BookingFacetedFilterOption<T> {
  value: T;
  label: string;
}

export interface BookingFacetedFilterProps<T> {
  label: string;
  options: BookingFacetedFilterOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
  selectedCountLabel: (count: number) => string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  clearLabel: string;
  emptyLabel: string;
}

const MAX_INLINE_BADGES = 2;

export function BookingFacetedFilter<T extends string | number>({
  label,
  options,
  selected,
  onChange,
  selectedCountLabel,
  showSearch = true,
  searchPlaceholder,
  clearLabel,
  emptyLabel,
}: BookingFacetedFilterProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const toggle = (value: T) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const selectedLabels = selected.map((v) => options.find((o) => o.value === v)?.label ?? String(v));

  const filteredOptions = searchText
    ? options.filter((o) => o.label.toLowerCase().includes(searchText.toLowerCase()))
    : options;

  const content = (
    <div className="flex flex-col w-[220px]">
      {showSearch && (
        <div className="flex items-center gap-2 h-9 px-3 border-b border-admin-border">
          <Search size={14} className="shrink-0 text-admin-muted-soft" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={searchPlaceholder ?? label}
            className="w-full text-sm outline-none placeholder:text-admin-muted-soft"
          />
        </div>
      )}
      <div className="max-h-[240px] overflow-y-auto p-1">
        {filteredOptions.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <button
              type="button"
              key={String(option.value)}
              onClick={() => toggle(option.value)}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-admin-ink hover:bg-admin-bg"
            >
              <span
                className={`flex size-4 items-center justify-center rounded-[4px] border ${
                  checked ? "border-admin-warning bg-admin-warning" : "border-admin-border"
                }`}
              >
                {checked && <Check size={12} className="text-white" />}
              </span>
              <span>{option.label}</span>
            </button>
          );
        })}
        {filteredOptions.length === 0 && (
          <div className="px-2 py-1.5 text-xs text-admin-muted-soft text-center">{emptyLabel}</div>
        )}
      </div>
      {selected.length > 0 && (
        <>
          <div className="h-px bg-admin-border" />
          <button
            type="button"
            onClick={() => onChange([])}
            className="p-2 text-sm text-admin-ink-soft hover:bg-admin-bg text-center"
          >
            {clearLabel}
          </button>
        </>
      )}
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearchText("");
      }}
      trigger="click"
      placement="bottomLeft"
      content={content}
      arrow={false}
      styles={{ body: { padding: 0 } }}
    >
      <FilterTriggerButton icon={<CirclePlus size={16} />}>
        {label}
        {selected.length > 0 && (
          <>
            <span className="mx-0.5 h-4 w-px bg-admin-border" />
            {selected.length > MAX_INLINE_BADGES ? (
              <FilterBadge>{selectedCountLabel(selected.length)}</FilterBadge>
            ) : (
              selectedLabels.map((selectedLabel) => (
                <FilterBadge key={selectedLabel}>{selectedLabel}</FilterBadge>
              ))
            )}
          </>
        )}
      </FilterTriggerButton>
    </Popover>
  );
}
