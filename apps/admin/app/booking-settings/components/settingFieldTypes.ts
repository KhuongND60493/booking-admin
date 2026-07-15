import type { FieldValues, Path } from "react-hook-form";

export type SelectOption = { value: string | number; labelKey?: string; label?: string };

interface BaseFieldItem<TValues extends FieldValues> {
  kind: "field";
  name: Path<TValues>;
  labelKey: string;
  tooltipKey?: string;
  placeholderKey?: string;
}

export interface NumberFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "number";
  suffixKey?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface BooleanFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "boolean";
}

export interface TextFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "text";
  maxLength?: number;
}

export interface TextareaFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "textarea";
  rows?: number;
  maxLength?: number;
}

export interface SelectFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "select";
  /** Options tĩnh khai trực tiếp trong config. */
  options?: SelectOption[];
  /** Key để tra options động do page bơm vào runtime (ưu tiên hơn `options` nếu cùng có). */
  optionsKey?: string;
  allowClear?: boolean;
}

export interface MultiSelectFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "multiselect";
  options?: SelectOption[];
  optionsKey?: string;
  maxTagCount?: number | "responsive";
}

export interface TimeFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "time";
  /** Format hiển thị của TimePicker, mặc định "HH:mm". */
  format?: string;
}

export interface DateFieldItem<TValues extends FieldValues> extends BaseFieldItem<TValues> {
  type: "date";
  /** Format hiển thị của DatePicker, mặc định "DD/MM/YYYY". */
  format?: string;
}

export type FieldItem<TValues extends FieldValues> =
  | NumberFieldItem<TValues>
  | BooleanFieldItem<TValues>
  | TextFieldItem<TValues>
  | TextareaFieldItem<TValues>
  | SelectFieldItem<TValues>
  | MultiSelectFieldItem<TValues>
  | TimeFieldItem<TValues>
  | DateFieldItem<TValues>;

export type SettingItem<TValues extends FieldValues> =
  | FieldItem<TValues>
  | { kind: "divider" }
  | { kind: "heading"; labelKey: string }
  | { kind: "note"; labelKey: string };

/** Map key → options, dùng cho select/multiselect có options động từ API. */
export type OptionsMap = Record<string, SelectOption[]>;
