import { Tag, Button, Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Pencil, Trash2 } from "lucide-react";
import type { TFunction } from "i18next";
import type { BookingTableRow } from "@skybooking/api-client";

export interface BookingTableColumnsOptions {
  t: TFunction;
  storeNameMap: Record<number, string>;
  onEdit: (record: BookingTableRow) => void;
  onDelete: (record: BookingTableRow) => void;
  isDeleting: boolean;
}

export function buildBookingTableColumns({
  t,
  storeNameMap,
  onEdit,
  onDelete,
  isDeleting,
}: BookingTableColumnsOptions): ColumnsType<BookingTableRow> {
  return [
    {
      title: t("column.store"),
      key: "store",
      render: (_, record) => storeNameMap[record.storeId] ?? record.storeId,
    },
    {
      title: t("column.tableCode"),
      dataIndex: "tableCode",
      key: "tableCode",
      width: 100,
      render: (code: string | null | undefined) => code || "—",
    },
    {
      title: t("column.tableName"),
      dataIndex: "tableName",
      key: "tableName",
      width: 100,
      render: (name: string | null | undefined) => name || "—",
    },
    {
      title: t("column.area"),
      key: "area",
      width: 140,
      render: (_, record) =>
        record.areaId === 0 ? t("area.unassigned") : t("area.named", { areaId: record.areaId }),
    },
    {
      title: t("column.capacity"),
      key: "capacity",
      width: 150,
      render: (_, record) => {
        const capacityLabel = record.minCapacity != null
          ? t("card.capacityRange", { min: record.minCapacity, max: record.maxCapacity })
          : t("card.capacity", { count: record.maxCapacity });

        return capacityLabel;
      },
    },
    {
      title: t("column.status"),
      key: "active",
      width: 130,
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "default"}>
          {record.isActive ? t("status.active") : t("status.inactive")}
        </Tag>
      ),
    },
    {
      title:'',
      key: "actions",
      width: 88,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1.5">
          <Tooltip title={t("action.edit")}>
            <Button
              size="small"
              icon={<Pencil size={14} />}
              aria-label={t("action.edit")}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t("confirmDelete.title")}
            description={t("confirmDelete.description")}
            okText={t("confirmDelete.ok")}
            cancelText={t("confirmDelete.cancel")}
            onConfirm={() => onDelete(record)}
          >
            <Tooltip title={t("action.delete")}>
              <Button
                size="small"
                danger
                icon={<Trash2 size={14} />}
                aria-label={t("action.delete")}
                loading={isDeleting}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];
}
