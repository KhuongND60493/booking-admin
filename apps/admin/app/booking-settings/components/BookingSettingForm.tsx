"use client";

import { useEffect } from "react";
import { Form, Select, Skeleton } from "antd";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BookingSetting } from "@skybooking/api-client";
import { useTranslation } from "../../i18n/client";
import { bookingSettingFormSchema, type BookingSettingFormValues } from "./bookingSettingFormSchema";
import { BOOKING_SETTING_FIELDS } from "./bookingSettingFields";
import { OverridableField } from "./OverridableField";
import type { OptionsMap } from "./settingFieldTypes";

export interface BookingSettingFormProps {
  formId: string;
  storeId: number;
  storeName?: string;
  storeOptions: { value: number; label: string }[];
  data: BookingSetting;
  optionsMap?: OptionsMap;
  onStoreChange: (storeId: number) => void;
  onSubmit: (values: BookingSettingFormValues) => void;
}

export function BookingSettingForm({
  formId,
  storeId,
  storeName,
  storeOptions,
  data,
  optionsMap,
  onStoreChange,
  onSubmit,
}: BookingSettingFormProps) {
  const { t } = useTranslation("booking-settings");

  const { control, handleSubmit, watch, reset } = useForm<BookingSettingFormValues>({
    resolver: zodResolver(bookingSettingFormSchema),
    defaultValues: data,
  });

  useEffect(() => {
    reset(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const submit = handleSubmit((values) => onSubmit(values));
  const isGlobal = storeId === 0;

  return (
    <Form id={formId} layout="vertical" onFinish={submit} className="space-y-4">
      <Form.Item label={t("field.storeSelector")}>
        <Select
          className="w-full"
          value={storeId}
          onChange={onStoreChange}
          options={storeOptions}
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      {!isGlobal && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-admin-info/20 bg-admin-info/5 p-3">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-admin-info" />
          <p className="text-xs leading-relaxed text-admin-ink-soft">
            {t("guideline.overrideMode", { store: storeName ?? "" })}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {BOOKING_SETTING_FIELDS.map((item, index) => {
          if (item.kind === "field") {
            return (
              <OverridableField
                key={item.name}
                control={control}
                item={item}
                storeId={storeId}
                overrideOn={!!watch(`${item.name}_OverrideForStore` as keyof BookingSettingFormValues as never)}
                optionsMap={optionsMap}
              />
            );
          }
          if (item.kind === "heading") {
            return (
              <h3 key={index} className="mb-1 mt-2 text-sm font-semibold text-admin-ink">
                {t(item.labelKey)}
              </h3>
            );
          }
          if (item.kind === "note") {
            return (
              <p key={index} className="text-xs text-admin-muted">
                {t(item.labelKey)}
              </p>
            );
          }
          return <div key={index} className="my-2 border-t border-admin-border" />;
        })}
      </div>
    </Form>
  );
}

export function BookingSettingFormSkeleton() {
  return <Skeleton active paragraph={{ rows: 6 }} />;
}
