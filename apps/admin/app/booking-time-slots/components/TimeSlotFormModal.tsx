"use client";

import { useEffect, useMemo } from "react";
import { Modal, Form, Input, InputNumber, TimePicker, Select, Switch, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {
  ALL_BOOKING_DAYS_OF_WEEK,
  BOOKING_DAY_OF_WEEK_I18N_KEY,
  type BookingTimeSlot,
} from "@skybooking/api-client";
import { useTranslation } from "../../i18n/client";
import { timeSlotFormSchema, type TimeSlotFormValues } from "./timeSlotFormSchema";
import { decodeApiTime } from "./timeSlotTime";

export interface TimeSlotFormModalProps {
  open: boolean;
  initialValue: BookingTimeSlot | null;
  storeOptions: { value: number; label: string }[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (values: TimeSlotFormValues) => void;
}

function decodeDaysOfWeek(bitmask: number): number[] {
  return ALL_BOOKING_DAYS_OF_WEEK.filter((day) => (bitmask & day) === day);
}

function buildDefaultValues(initialValue: BookingTimeSlot | null): TimeSlotFormValues {
  if (!initialValue) {
    return {
      storeIds: [],
      name: "",
      startTime: dayjs().hour(9).minute(0),
      endTime: dayjs().hour(10).minute(0),
      daysOfWeek: [],
      sortOrder: undefined,
      isActive: true,
    };
  }
  return {
    storeIds: initialValue.storeIds ?? [],
    name: initialValue.name ?? "",
    startTime: decodeApiTime(initialValue.startTime),
    endTime: decodeApiTime(initialValue.endTime),
    daysOfWeek: decodeDaysOfWeek(initialValue.daysOfWeek),
    sortOrder: initialValue.sortOrder ?? undefined,
    isActive: initialValue.isActive,
  };
}

export function TimeSlotFormModal({
  open,
  initialValue,
  storeOptions,
  isSubmitting,
  onCancel,
  onSubmit,
}: TimeSlotFormModalProps) {
  const { t } = useTranslation("booking-time-slots");

  const defaultValues = useMemo(() => buildDefaultValues(initialValue), [initialValue]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TimeSlotFormValues>({
    resolver: zodResolver(timeSlotFormSchema),
    values: defaultValues,
  });

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  const dayOptions = ALL_BOOKING_DAYS_OF_WEEK.map((day) => ({
    value: day,
    label: t(`dayOfWeek.${BOOKING_DAY_OF_WEEK_I18N_KEY[day]}`),
  }));

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
        <Form.Item label={t("modal.field.store")}>
          <Controller
            control={control}
            name="storeIds"
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                className="w-full"
                options={storeOptions}
                placeholder={t("modal.field.storePlaceholderAll")}
                maxTagCount="responsive"
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={t("modal.field.name")}
          required
          validateStatus={errors.name ? "error" : undefined}
          help={errors.name ? t("modal.error.nameRequired") : undefined}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input {...field} placeholder={t("modal.field.namePlaceholder")} />}
          />
        </Form.Item>
        <Form.Item
          label={t("modal.field.startTime")}
          required
          validateStatus={errors.startTime ? "error" : undefined}
          help={errors.startTime ? t("modal.error.startTimeRequired") : undefined}
        >
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <TimePicker
                {...field}
                format="HH:mm"
                className="w-full"
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={t("modal.field.endTime")}
          required
          validateStatus={errors.endTime ? "error" : undefined}
          help={
            errors.endTime
              ? t(
                  errors.endTime.message === "endTimeAfterStartTime"
                    ? "modal.error.endTimeAfterStartTime"
                    : "modal.error.endTimeRequired"
                )
              : undefined
          }
        >
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => (
              <TimePicker
                {...field}
                format="HH:mm"
                className="w-full"
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label={t("modal.field.daysOfWeek")}
          required
          validateStatus={errors.daysOfWeek ? "error" : undefined}
          help={errors.daysOfWeek ? t("modal.error.daysOfWeekRequired") : undefined}
        >
          <Controller
            control={control}
            name="daysOfWeek"
            render={({ field }) => (
              <Select
                {...field}
                mode="multiple"
                className="w-full"
                options={dayOptions}
                maxTagCount="responsive"
              />
            )}
          />
        </Form.Item>
        <Form.Item label={t("modal.field.sortOrder")}>
          <Controller
            control={control}
            name="sortOrder"
            render={({ field }) => (
              <InputNumber
                {...field}
                className="w-full"
                min={0}
                step={1}
                precision={0}
                placeholder={t("modal.field.sortOrderPlaceholder")}
                value={field.value ?? null}
                onChange={(value) => field.onChange(value ?? undefined)}
              />
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
