"use client";

import { DatePicker, Input, InputNumber, Select, Switch, TimePicker, Tooltip } from "antd";
import { Lock, LockOpen } from "lucide-react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { useTranslation } from "../../i18n/client";
import type { FieldItem, OptionsMap, SelectOption } from "./settingFieldTypes";

const DEFAULT_TIME_FORMAT = "HH:mm";
const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";

export interface OverridableFieldProps<TValues extends FieldValues> {
  control: Control<TValues>;
  item: FieldItem<TValues>;
  storeId: number;
  overrideOn: boolean;
  optionsMap?: OptionsMap;
}

export function OverridableField<TValues extends FieldValues>({
  control,
  item,
  storeId,
  overrideOn,
  optionsMap,
}: OverridableFieldProps<TValues>) {
  const { t } = useTranslation("booking-settings");
  const overrideName = `${item.name}_OverrideForStore` as Path<TValues>;
  const isGlobal = storeId === 0;
  const disabled = !isGlobal && !overrideOn;
  const required = isGlobal || overrideOn;

  const resolveOptions = (opts?: SelectOption[], optionsKey?: string): { value: string | number; label: string }[] => {
    const source = (optionsKey && optionsMap?.[optionsKey]) || opts || [];
    return source.map((o) => ({ value: o.value, label: o.labelKey ? t(o.labelKey) : (o.label ?? String(o.value)) }));
  };

  const overrideLock = !isGlobal && (
    <Controller
      control={control}
      name={overrideName}
      render={({ field: { value, onChange } }) => (
        <Tooltip title={t(value ? "field.overrideOn" : "field.overrideOff")}>
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
              value
                ? "bg-admin-info/10 text-admin-info hover:bg-admin-info/20"
                : "text-admin-muted-soft hover:bg-admin-bg hover:text-admin-muted"
            }`}
          >
            {value ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          </button>
        </Tooltip>
      )}
    />
  );

  const labelRow = (
    <div className="flex items-center gap-2">
      {overrideLock}
      <span className={`text-sm font-medium ${disabled ? "text-admin-muted" : "text-admin-ink"}`}>
        {t(item.labelKey)}
      </span>
    </div>
  );

  const placeholder = item.placeholderKey ? t(item.placeholderKey) : undefined;

  const control_ = (
    <Controller
      control={control}
      name={item.name}
      rules={{ required }}
      render={({ field }) => {
        switch (item.type) {
          case "number":
            return (
              <InputNumber
                {...field}
                min={item.min}
                max={item.max}
                step={item.step}
                disabled={disabled}
                suffix={item.suffixKey ? t(item.suffixKey) : undefined}
                placeholder={placeholder}
                className="w-full"
              />
            );
          case "boolean":
            return <Switch checked={!!field.value} onChange={field.onChange} disabled={disabled} />;
          case "text":
            return (
              <Input {...field} maxLength={item.maxLength} disabled={disabled} placeholder={placeholder} />
            );
          case "textarea":
            return (
              <Input.TextArea
                {...field}
                rows={item.rows ?? 3}
                maxLength={item.maxLength}
                disabled={disabled}
                placeholder={placeholder}
              />
            );
          case "select":
            return (
              <Select
                {...field}
                disabled={disabled}
                allowClear={item.allowClear}
                placeholder={placeholder}
                options={resolveOptions(item.options, item.optionsKey)}
                showSearch
                optionFilterProp="label"
                className="w-full"
              />
            );
          case "multiselect":
            return (
              <Select
                {...field}
                mode="multiple"
                disabled={disabled}
                placeholder={placeholder}
                options={resolveOptions(item.options, item.optionsKey)}
                maxTagCount={item.maxTagCount ?? "responsive"}
                showSearch
                optionFilterProp="label"
                className="w-full"
              />
            );
          case "time":
            return (
              <TimePicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                format={item.format ?? DEFAULT_TIME_FORMAT}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full"
              />
            );
          case "date":
            return (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                format={item.format ?? DEFAULT_DATE_FORMAT}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full"
              />
            );
          default:
            return <span />;
        }
      }}
    />
  );

  if (item.type === "boolean") {
    return (
      <div className="flex items-center justify-between gap-3">
        {labelRow}
        {control_}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2">{labelRow}</div>
      {control_}
    </div>
  );
}
