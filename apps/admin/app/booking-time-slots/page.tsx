"use client";

import { useMemo, useState } from "react";
import { Table } from "antd";
import { Button } from "antd";
import {
  useStoresByBrand,
  useBookingTimeSlotsQuery,
  useCreateBookingTimeSlotMutation,
  useUpdateBookingTimeSlotMutation,
  useDeleteBookingTimeSlotMutation,
} from "@skybooking/hooks";
import { PageActionContainer, PageActionGroup } from "@skybooking/ui";
import { DEFAULT_ORGANIZATION_ID, type BookingTimeSlot } from "@skybooking/api-client";
import { useTranslation } from "../i18n/client";
import { TimeSlotFilterBar } from "./components/TimeSlotFilterBar";
import { TimeSlotFormModal } from "./components/TimeSlotFormModal";
import { buildTimeSlotColumns } from "./components/timeSlotColumns";
import type { TimeSlotFormValues } from "./components/timeSlotFormSchema";
import { encodeApiTime } from "./components/timeSlotTime";

export default function BookingTimeSlotsPage() {
  const { t } = useTranslation("booking-time-slots");

  const { stores } = useStoresByBrand();
  const storeOptions = useMemo(() => stores.map((s) => ({ value: s.id, label: s.name })), [stores]);
  const storeNameMap = useMemo(
    () => Object.fromEntries(stores.map((s) => [s.id, s.name])),
    [stores]
  );

  const [storeIds, setStoreIds] = useState<number[]>([]);
  const [isActiveValues, setIsActiveValues] = useState<("active" | "inactive")[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);

  const isActiveParam =
    isActiveValues.length === 1 ? isActiveValues[0] === "active" : undefined;
  const dayOfWeekParam =
    daysOfWeek.length === 0 ? undefined : daysOfWeek.reduce((sum, day) => sum + day, 0);

  const queryParams = useMemo(
    () => ({ storeIds, isActive: isActiveParam, dayOfWeek: dayOfWeekParam }),
    [storeIds, isActiveParam, dayOfWeekParam]
  );

  const { data: timeSlots = [], isLoading } = useBookingTimeSlotsQuery(queryParams);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<BookingTimeSlot | null>(null);

  const createMutation = useCreateBookingTimeSlotMutation({
    meta: { successMessageKey: "toast.success.createTimeSlot" },
  });
  const updateMutation = useUpdateBookingTimeSlotMutation({
    meta: { successMessageKey: "toast.success.updateTimeSlot" },
  });
  const deleteMutation = useDeleteBookingTimeSlotMutation({
    meta: { successMessageKey: "toast.success.deleteTimeSlot" },
  });

  const openCreate = () => {
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const openEdit = (record: BookingTimeSlot) => {
    setEditingSlot(record);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (values: TimeSlotFormValues) => {
    const daysOfWeek = values.daysOfWeek.reduce((sum, day) => sum + day, 0);
    const payload = {
      organizationId: DEFAULT_ORGANIZATION_ID,
      storeIds: values.storeIds,
      name: values.name.trim(),
      startTime: encodeApiTime(values.startTime),
      endTime: encodeApiTime(values.endTime),
      isActive: values.isActive,
      sortOrder: values.sortOrder,
      daysOfWeek,
    };

    if (editingSlot) {
      await updateMutation.mutateAsync({ ...payload, id: editingSlot.id });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (record: BookingTimeSlot) => {
    deleteMutation.mutate(record.id);
  };

  const columns = buildTimeSlotColumns({
    t,
    storeNameMap,
    onEdit: openEdit,
    onDelete: handleDelete,
    isDeleting: deleteMutation.isPending,
  });

  return (
    <div className="p-4">
      <h1 className="font-heading text-xl font-bold text-admin-ink mb-4">{t("title")}</h1>

      <PageActionContainer className="mb-4">
        <PageActionGroup>
          <TimeSlotFilterBar
            storeOptions={storeOptions}
            storeIds={storeIds}
            onStoreIdsChange={setStoreIds}
            isActiveValues={isActiveValues}
            onIsActiveValuesChange={setIsActiveValues}
            daysOfWeek={daysOfWeek}
            onDaysOfWeekChange={setDaysOfWeek}
            t={t}
          />
        </PageActionGroup>
        <PageActionGroup noWrap>
          <Button type="primary" onClick={openCreate}>
            {t("addButton")}
          </Button>
        </PageActionGroup>
      </PageActionContainer>

      <Table<BookingTimeSlot>
        rowKey="id"
        columns={columns}
        dataSource={timeSlots}
        loading={isLoading}
        bordered
        pagination={{ pageSize: 20, showSizeChanger: false }}
        locale={{ emptyText: t("empty") }}
      />

      <TimeSlotFormModal
        open={isModalOpen}
        initialValue={editingSlot}
        storeOptions={storeOptions}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
