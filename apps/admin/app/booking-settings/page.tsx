"use client";

import { useMemo, useState } from "react";
import { Button, Spin } from "antd";
import { useStoresByBrand, useBookingSettingQuery, useUpdateBookingSettingMutation } from "@skybooking/hooks";
import { useTranslation } from "../i18n/client";
import { BookingSettingForm, BookingSettingFormSkeleton } from "./components/BookingSettingForm";
import type { BookingSettingFormValues } from "./components/bookingSettingFormSchema";

const FORM_ID = "booking-setting-form";

export default function BookingSettingsPage() {
  const { t } = useTranslation("booking-settings");

  const { stores } = useStoresByBrand();
  const storeOptions = useMemo(
    () => [{ value: 0, label: t("field.allStores") }, ...stores.map((s) => ({ value: s.id, label: s.name }))],
    [stores, t]
  );

  const [storeId, setStoreId] = useState(0);

  const { data, isLoading, isFetching } = useBookingSettingQuery(storeId);

  const updateMutation = useUpdateBookingSettingMutation({
    meta: { successMessageKey: "toast.success.saveBookingSetting" },
  });

  const handleSubmit = (values: BookingSettingFormValues) => {
    updateMutation.mutate({ storeId, data: values });
  };

  const selectedStoreName = stores.find((s) => s.id === storeId)?.name;

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-bold text-admin-ink mb-1">{t("title")}</h1>
          <p className="text-xs text-admin-muted">{t("subtitle")}</p>
        </div>
        <Button type="primary" htmlType="submit" form={FORM_ID} loading={updateMutation.isPending}>
          {t("save")}
        </Button>
      </div>

      <div className="mx-auto w-full max-w-[558px] rounded-lg border border-admin-border bg-admin-surface p-6">
        {isLoading && !data ? (
          <BookingSettingFormSkeleton />
        ) : (
          <Spin spinning={isFetching}>
            {data && (
              <BookingSettingForm
                formId={FORM_ID}
                storeId={storeId}
                storeName={selectedStoreName}
                storeOptions={storeOptions}
                data={data}
                onStoreChange={setStoreId}
                onSubmit={handleSubmit}
              />
            )}
          </Spin>
        )}
      </div>
    </div>
  );
}
