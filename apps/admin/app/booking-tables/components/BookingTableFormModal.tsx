"use client";

import { useEffect, useMemo } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BookingTableRow } from "@skybooking/api-client";
import { useTranslation } from "../../i18n/client";
import { bookingTableFormSchema, type BookingTableFormValues } from "./bookingTableFormSchema";

export interface BookingTableFormModalProps {
  open: boolean;
  initialValue: BookingTableRow | null;
  storeOptions: { value: number; label: string }[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: BookingTableFormValues) => void;
}

function buildDefaultValues(
  initialValue: BookingTableRow | null,
  defaultStoreId: number
): BookingTableFormValues {
  if (!initialValue) {
    return {
      storeId: defaultStoreId,
      refId: null,
      tableCode: "",
      tableName: "",
      areaId: 0,
      capacity: 2,
      minCapacity: 1,
      maxCapacity: 4,
      isActive: true,
    };
  }
  return {
    storeId: initialValue.storeId,
    refId: initialValue.refId ?? null,
    tableCode: initialValue.tableCode ?? "",
    tableName: initialValue.tableName ?? "",
    areaId: initialValue.areaId,
    capacity: initialValue.capacity ?? initialValue.maxCapacity,
    minCapacity: initialValue.minCapacity ?? 1,
    maxCapacity: initialValue.maxCapacity,
    isActive: initialValue.isActive,
  };
}

export function BookingTableFormModal({
  open,
  initialValue,
  storeOptions,
  isSubmitting,
  onCancel,
  onSubmit,
}: BookingTableFormModalProps) {
  const { t } = useTranslation("booking-tables");

  const defaultStoreId = storeOptions[0]?.value ?? 0;
  const defaultValues = useMemo(
    () => buildDefaultValues(initialValue, defaultStoreId),
    [initialValue, defaultStoreId]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingTableFormValues>({
    resolver: zodResolver(bookingTableFormSchema),
    values: defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <Modal
      open={open}
      title={initialValue ? t("modal.titleEdit") : t("modal.titleAdd")}
      confirmLoading={isSubmitting}
      onCancel={onCancel}
      destroyOnHidden
      centered
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>{t("modal.cancel")}</Button>
          <Button type="primary" loading={isSubmitting} onClick={submit}>
            {t("modal.ok")}
          </Button>
        </div>
      }
      styles={{
        content: { padding: 0 },
        header: { padding: 16 },
        footer: { padding: 16, marginTop: 0 },
        body: {
          minHeight: 0,
          maxHeight: "calc(90vh - 120px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <Form layout="vertical">
          <Form.Item
            label={t("modal.field.store")}
            required
            validateStatus={errors.storeId ? "error" : undefined}
            help={errors.storeId ? t("modal.error.storeRequired") : undefined}
          >
            <Controller
              control={control}
              name="storeId"
              render={({ field }) => (
                <Select {...field} className="w-full" options={storeOptions} />
              )}
            />
          </Form.Item>
          <Form.Item label={t("modal.field.refId")}>
            <Controller
              control={control}
              name="refId"
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  step={1}
                  precision={0}
                  value={field.value ?? null}
                  onChange={(value) => field.onChange(value ?? null)}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label={t("modal.field.tableCode")}
            required
            validateStatus={errors.tableCode ? "error" : undefined}
            help={errors.tableCode ? t("modal.error.tableCodeRequired") : undefined}
          >
            <Controller
              control={control}
              name="tableCode"
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item
            label={t("modal.field.tableName")}
            required
            validateStatus={errors.tableName ? "error" : undefined}
            help={errors.tableName ? t("modal.error.tableNameRequired") : undefined}
          >
            <Controller
              control={control}
              name="tableName"
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>
          <Form.Item label={t("modal.field.areaId")}>
            <Controller
              control={control}
              name="areaId"
              render={({ field }) => (
                <InputNumber {...field} className="w-full" min={0} step={1} precision={0} />
              )}
            />
          </Form.Item>
          <Form.Item
            label={t("modal.field.capacity")}
            required
            validateStatus={errors.capacity ? "error" : undefined}
            help={errors.capacity ? t("modal.error.capacityRequired") : undefined}
          >
            <Controller
              control={control}
              name="capacity"
              render={({ field }) => (
                <InputNumber {...field} className="w-full" min={1} step={1} precision={0} />
              )}
            />
          </Form.Item>
          <Form.Item
            label={t("modal.field.minCapacity")}
            required
            validateStatus={errors.minCapacity ? "error" : undefined}
            help={
              errors.minCapacity
                ? t(
                    errors.minCapacity.message === "minMaxCapacity"
                      ? "modal.error.minMaxCapacity"
                      : "modal.error.minCapacityRequired"
                  )
                : undefined
            }
          >
            <Controller
              control={control}
              name="minCapacity"
              render={({ field }) => (
                <InputNumber {...field} className="w-full" min={1} step={1} precision={0} />
              )}
            />
          </Form.Item>
          <Form.Item
            label={t("modal.field.maxCapacity")}
            required
            validateStatus={errors.maxCapacity ? "error" : undefined}
            help={errors.maxCapacity ? t("modal.error.maxCapacityRequired") : undefined}
          >
            <Controller
              control={control}
              name="maxCapacity"
              render={({ field }) => (
                <InputNumber {...field} className="w-full" min={1} step={1} precision={0} />
              )}
            />
          </Form.Item>
          <Form.Item label={t("modal.field.isActive")}>
            <Controller
              control={control}
              name="isActive"
              render={({ field: { value, onChange, ...field } }) => (
                <Switch {...field} checked={value} onChange={onChange} />
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
}
