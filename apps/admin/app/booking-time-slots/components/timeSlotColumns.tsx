import { Tag, Button, Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  ALL_BOOKING_DAYS_OF_WEEK,
  ALL_BOOKING_DAYS_OF_WEEK_MASK,
  BOOKING_DAY_OF_WEEK_I18N_KEY,
  type BookingTimeSlot,
} from "@skybooking/api-client";
import type { TFunction } from "i18next";
import { formatApiTimeForDisplay } from "./timeSlotTime";
import { Pencil, Trash2 } from "lucide-react";

export interface TimeSlotColumnsOptions {
  t: TFunction;
  storeNameMap: Record<number, string>;
  onEdit: (record: BookingTimeSlot) => void;
  onDelete: (record: BookingTimeSlot) => void;
  isDeleting: boolean;
}

export function buildTimeSlotColumns({
  t,
  storeNameMap,
  onEdit,
  onDelete,
  isDeleting,
}: TimeSlotColumnsOptions): ColumnsType<BookingTimeSlot> {
  return [
    {
      title: t("column.store"),
      key: "store",
      render: (_, record) => {
        const ids = record.storeIds;
        if (!ids || ids.length === 0) return t("filter.allStores");
        if (ids.length <= 2) {
          return ids.map((id) => storeNameMap[id] ?? id).join(", ");
        }
        return t("column.storeCount", { count: ids.length });
      },
    },
    {
      title: t("column.name"),
      dataIndex: "name",
      key: "name",
      render: (name: string | null | undefined) => name || "—",
    },
    {
      title: t("column.timeRange"),
      key: "timeRange",
      render: (_, record) => (
        <span className="font-medium">
          {formatApiTimeForDisplay(record.startTime)} - {formatApiTimeForDisplay(record.endTime)}
        </span>
      ),
    },
    {
      title: t("column.daysOfWeek"),
      key: "daysOfWeek",
      render: (_, record) => {
        if ((record.daysOfWeek & ALL_BOOKING_DAYS_OF_WEEK_MASK) === ALL_BOOKING_DAYS_OF_WEEK_MASK) {
          return <Tag>{t("column.allDaysOfWeek")}</Tag>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {ALL_BOOKING_DAYS_OF_WEEK.filter((day) => (record.daysOfWeek & day) === day).map((day) => (
              <Tag key={day}>{t(`dayOfWeek.${BOOKING_DAY_OF_WEEK_I18N_KEY[day]}`)}</Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: t("column.status"),
      key: "isActive",
      width: 130,
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "default"}>
          {record.isActive ? t("status.active") : t("status.inactive")}
        </Tag>
      ),
    },
    {
      title: '',
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
