"use client";

import { useMemo, useState } from "react";
import { Button, Table } from "antd";
import {
  useStoresByBrand,
  useBookingTablesQuery,
  useCreateBookingTableMutation,
  useUpdateBookingTableMutation,
  useDeleteBookingTableMutation,
} from "@skybooking/hooks";
import { PageActionContainer, PageActionGroup } from "@skybooking/ui";
import { DEFAULT_ORGANIZATION_ID, type BookingTableRow } from "@skybooking/api-client";
import { useTranslation } from "../i18n/client";
import { TableFilterBar } from "./components/TableFilterBar";
import { BookingTableCard } from "./components/BookingTableCard";
import { BookingTableFormModal } from "./components/BookingTableFormModal";
import { buildBookingTableColumns } from "./components/bookingTableColumns";
import { groupTablesByStoreAndArea } from "./components/groupTables";
import { ViewToggle, type ViewMode } from "./components/ViewToggle";
import type { BookingTableFormValues } from "./components/bookingTableFormSchema";

export default function BookingTablesPage() {
  const { t } = useTranslation("booking-tables");

  const { stores } = useStoresByBrand();
  const storeOptions = useMemo(() => stores.map((s) => ({ value: s.id, label: s.name })), [stores]);
  const storeNameMap = useMemo(
    () => Object.fromEntries(stores.map((s) => [s.id, s.name])),
    [stores]
  );

  const [storeIds, setStoreIds] = useState<number[]>([]);
  const [isActiveValues, setIsActiveValues] = useState<("active" | "inactive")[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const isActiveParam =
    isActiveValues.length === 1 ? isActiveValues[0] === "active" : undefined;

  const effectiveStoreIds = useMemo(
    () => (storeIds.length > 0 ? storeIds : stores.map((s) => s.id)),
    [storeIds, stores]
  );

  const queryParams = useMemo(
    () => ({ orgId: DEFAULT_ORGANIZATION_ID, storeIds: effectiveStoreIds, isActive: isActiveParam }),
    [effectiveStoreIds, isActiveParam]
  );

  const { data: tables = [], isLoading } = useBookingTablesQuery(queryParams);

  const groups = useMemo(() => groupTablesByStoreAndArea(tables), [tables]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<BookingTableRow | null>(null);

  const createMutation = useCreateBookingTableMutation({
    meta: { successMessageKey: "toast.success.createBookingTable" },
  });
  const updateMutation = useUpdateBookingTableMutation({
    meta: { successMessageKey: "toast.success.updateBookingTable" },
  });
  const deleteMutation = useDeleteBookingTableMutation({
    meta: { successMessageKey: "toast.success.deleteBookingTable" },
  });

  const openCreate = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const openEdit = (record: BookingTableRow) => {
    setEditingTable(record);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (values: BookingTableFormValues) => {
    const payload = {
      organizationId: DEFAULT_ORGANIZATION_ID,
      storeId: values.storeId,
      ...(values.refId != null ? { refId: values.refId } : {}),
      tableCode: values.tableCode.trim(),
      tableName: values.tableName.trim(),
      areaId: values.areaId,
      capacity: values.capacity,
      minCapacity: values.minCapacity,
      maxCapacity: values.maxCapacity,
      isActive: values.isActive,
    };

    if (editingTable) {
      await updateMutation.mutateAsync({
        ...payload,
        id: editingTable.id,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (record: BookingTableRow) => {
    deleteMutation.mutate(record.id);
  };

  const columns = buildBookingTableColumns({
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
          <TableFilterBar
            storeOptions={storeOptions}
            storeIds={storeIds}
            onStoreIdsChange={setStoreIds}
            isActiveValues={isActiveValues}
            onIsActiveValuesChange={setIsActiveValues}
            t={t}
          />
        </PageActionGroup>
        <PageActionGroup noWrap>
          <Button type="primary" onClick={openCreate}>
            {t("addButton")}
          </Button>
          <ViewToggle value={viewMode} onChange={setViewMode} t={t} />
        </PageActionGroup>
      </PageActionContainer>

      {effectiveStoreIds.length > 0 && viewMode === "table" && (
        <Table<BookingTableRow>
          rowKey="id"
          columns={columns}
          dataSource={tables}
          loading={isLoading}
          bordered
          scroll={{ x: 878 }}
          pagination={{ pageSize: 20, showSizeChanger: false }}
          locale={{ emptyText: t("empty.noTables") }}
        />
      )}

      {effectiveStoreIds.length > 0 && viewMode === "card" && isLoading && (
        <div className="rounded-lg border border-dashed border-admin-border py-16 text-center text-sm text-admin-muted">
          {t("loading")}
        </div>
      )}

      {effectiveStoreIds.length > 0 && viewMode === "card" && !isLoading && groups.length === 0 && (
        <div className="rounded-lg border border-dashed border-admin-border py-16 text-center text-sm text-admin-muted">
          {t("empty.noTables")}
        </div>
      )}

      {effectiveStoreIds.length > 0 && viewMode === "card" && !isLoading && groups.length > 0 && (
        <div className="flex flex-col gap-6">
          {groups.map((storeGroup) => (
            <div key={storeGroup.storeId} className="rounded-lg border border-admin-border bg-admin-surface p-4">
              <h2 className="mb-3 text-sm font-semibold text-admin-ink">
                {storeNameMap[storeGroup.storeId] ?? `#${storeGroup.storeId}`}
              </h2>
              <div className="flex flex-col gap-4">
                {storeGroup.areas.map((areaGroup) => (
                  <div key={areaGroup.areaId}>
                    <div className="mb-2 text-xs font-medium text-admin-muted">
                      {areaGroup.areaId === 0
                        ? t("area.unassigned")
                        : t("area.named", { areaId: areaGroup.areaId })}
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                      {areaGroup.tables.map((table) => (
                        <BookingTableCard
                          key={table.id}
                          table={table}
                          t={t}
                          onEdit={openEdit}
                          onDelete={handleDelete}
                          isDeleting={deleteMutation.isPending}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BookingTableFormModal
        open={isModalOpen}
        initialValue={editingTable}
        storeOptions={storeOptions}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
