import dayjs from "dayjs";
import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TFunction } from "i18next";
import type { Booking, BookingStatus } from "@skybooking/api-client";
import { bookingStatusMeta } from "../utils/bookingStatus";
import { BookingRowActions } from "./BookingRowActions";

interface BookingColumnsArgs {
  t: TFunction;
  storeNameMap: Record<number, string>;
  onConfirm: (id: number) => Promise<void>;
  onCheckIn: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  onNoShow: (id: number) => Promise<void>;
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
}

export function buildBookingColumns({
  t,
  storeNameMap,
  onConfirm,
  onCheckIn,
  onCancel,
  onNoShow,
  canView,
  canEdit,
  canCancel,
}: BookingColumnsArgs): ColumnsType<Booking> {
  return [
    {
      title: t("column.diningTime"),
      key: "diningTime",
      width: 120,
      sorter: (a, b) => a.startTime.localeCompare(b.startTime),
      defaultSortOrder: "descend",
      render: (_, b) => (
        <div>
          <div className="font-semibold text-admin-ink">{dayjs(b.startTime).format("HH:mm")}</div>
          <div className="text-xs text-admin-muted-soft">
            {dayjs(b.bookingDate).format("DD/MM/YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: t("column.id"),
      dataIndex: "bookingCode",
      key: "bookingCode",
      width: 110,
      render: (bookingCode: string) => (
        <span className="font-mono text-admin-muted-soft text-xs">{bookingCode}</span>
      ),
    },
    {
      title: t("column.store"),
      key: "store",
      width: 200,
      render: (_, b) => storeNameMap[b.storeId] ?? b.storeId,
    },
    {
      title: t("column.tables"),
      key: "tables",
      width: 80,
      render: (_, b) =>
        b.assignedTables?.length ? b.assignedTables.map((tbl) => tbl.tableCode).join(", ") : "—",
    },
    {
      title: t("column.partySize"),
      dataIndex: "guestCount",
      key: "guestCount",
      width: 100,
      align: "right",
    },
    {
      title: t("column.customer"),
      key: "customer",
      width: 200,
      render: (_, b) => <span className="font-medium text-admin-ink">{b.customerName}</span>,
    },
    {
      title: t("column.phone"),
      key: "phone",
      width: 140,
      render: (_, b) => b.customerPhone,
    },
    {
      title: t("column.status"),
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: BookingStatus) => {
        const meta = bookingStatusMeta(status, t);
        return <Tag color={meta.tagColor}>{meta.label}</Tag>;
      },
    },
    {
      title: "",
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_, b) => (
        <BookingRowActions
          booking={b}
          onConfirm={onConfirm}
          onCheckIn={onCheckIn}
          onCancel={onCancel}
          onNoShow={onNoShow}
          canView={canView}
          canEdit={canEdit}
          canCancel={canCancel}
          t={t}
        />
      ),
    },
  ];
}
