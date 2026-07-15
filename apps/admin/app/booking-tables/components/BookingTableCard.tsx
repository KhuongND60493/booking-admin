import type { TFunction } from "i18next";
import { Popconfirm, Tooltip } from "antd";
import { Pencil, Trash2 } from "lucide-react";
import type { BookingTableRow } from "@skybooking/api-client";

const MAX_SEATS_DRAWN = 12;

function distributeSeats(total: number): { top: number; bottom: number; left: number; right: number } {
  if (total <= 2) return { top: total, bottom: 0, left: 0, right: 0 };
  if (total <= 4) {
    const top = Math.ceil(total / 2);
    return { top, bottom: total - top, left: 0, right: 0 };
  }
  if (total <= 8) {
    const side = Math.floor(total / 4);
    let extra = total - side * 4;
    const seats = { top: side, bottom: side, left: side, right: side };
    const order: ("top" | "bottom" | "left" | "right")[] = ["top", "bottom", "left", "right"];
    for (let i = 0; extra > 0; i++, extra--) seats[order[i % 4]]++;
    return seats;
  }
  const horizontal = total - 4;
  const top = Math.ceil(horizontal / 2);
  return { top, bottom: horizontal - top, left: 2, right: 2 };
}

const SEAT_LONG = 13;
const SEAT_SHORT = 8;
const SEAT_GAP = 5;
const SEAT_OFFSET = 5;
const PAD = 4;

function TableIllustration({ seatCount }: { seatCount: number }) {
  const seats = Math.max(1, Math.min(seatCount, MAX_SEATS_DRAWN));
  const { top, bottom, left, right } = distributeSeats(seats);

  const seatSpan = SEAT_LONG + SEAT_GAP;
  const cols = Math.max(top, bottom, 1);
  const rows = Math.max(left, right, 1);
  const tableW = Math.max(cols * seatSpan + SEAT_GAP, 34);
  const tableH = Math.max(rows * seatSpan + SEAT_GAP, 34);

  const tableX = PAD + (left > 0 ? SEAT_SHORT + SEAT_OFFSET : 0);
  const tableY = PAD + (top > 0 ? SEAT_SHORT + SEAT_OFFSET : 0);
  const W = tableX + tableW + (right > 0 ? SEAT_SHORT + SEAT_OFFSET : 0) + PAD;
  const H = tableY + tableH + (bottom > 0 ? SEAT_SHORT + SEAT_OFFSET : 0) + PAD;

  const seatClass = "fill-admin-muted-soft/45";
  const spread = (count: number, from: number, to: number) =>
    Array.from({ length: count }, (_, i) => from + ((i + 1) * (to - from)) / (count + 1));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-16 w-16 shrink-0" aria-hidden="true">
      {spread(top, tableX, tableX + tableW).map((x, i) => (
        <rect key={`t${i}`} x={x - SEAT_LONG / 2} y={tableY - SEAT_OFFSET - SEAT_SHORT} width={SEAT_LONG} height={SEAT_SHORT} rx={3} className={seatClass} />
      ))}
      {spread(bottom, tableX, tableX + tableW).map((x, i) => (
        <rect key={`b${i}`} x={x - SEAT_LONG / 2} y={tableY + tableH + SEAT_OFFSET} width={SEAT_LONG} height={SEAT_SHORT} rx={3} className={seatClass} />
      ))}
      {spread(left, tableY, tableY + tableH).map((y, i) => (
        <rect key={`l${i}`} x={tableX - SEAT_OFFSET - SEAT_SHORT} y={y - SEAT_LONG / 2} width={SEAT_SHORT} height={SEAT_LONG} rx={3} className={seatClass} />
      ))}
      {spread(right, tableY, tableY + tableH).map((y, i) => (
        <rect key={`r${i}`} x={tableX + tableW + SEAT_OFFSET} y={y - SEAT_LONG / 2} width={SEAT_SHORT} height={SEAT_LONG} rx={3} className={seatClass} />
      ))}
      <rect
        x={tableX}
        y={tableY}
        width={tableW}
        height={tableH}
        rx={6}
        className="fill-admin-bg stroke-admin-muted-soft/60"
        strokeWidth={2}
      />
    </svg>
  );
}

export interface BookingTableCardProps {
  table: BookingTableRow;
  t: TFunction;
  onEdit: (table: BookingTableRow) => void;
  onDelete: (table: BookingTableRow) => void;
  isDeleting: boolean;
}

export function BookingTableCard({ table, t, onEdit, onDelete, isDeleting }: BookingTableCardProps) {
  const label = table.tableName || table.tableCode || `#${table.id}`;
  const isActive = table.isActive;
  const capacityLabel =
    table.minCapacity != null
      ? t("card.capacityRange", { min: table.minCapacity, max: table.maxCapacity })
      : t("card.capacity", { count: table.maxCapacity });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(table)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onEdit(table);
      }}
      className="group flex cursor-pointer flex-col gap-2 rounded-xl border border-admin-border bg-white p-3 transition-colors hover:border-admin-info"
    >
      <div className="flex min-h-[20px] justify-end">
        <span
          className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 text-[11px] font-medium ${
            isActive
              ? "bg-admin-success/10 text-admin-success"
              : "bg-admin-danger/10 text-admin-danger"
          }`}
        >
          {isActive ? t("status.active") : t("status.inactive")}
        </span>
      </div>

      <div className="flex justify-center">
        <TableIllustration seatCount={table.maxCapacity} />
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-admin-ink">{label}</div>
          <div className="text-xs text-admin-muted">{capacityLabel}</div>
        </div>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <Tooltip title={t("action.edit")}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(table);
              }}
              aria-label={t("action.edit")}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-admin-muted-soft hover:bg-admin-info/10 hover:text-admin-info"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
          <Popconfirm
            title={t("confirmDelete.title")}
            description={t("confirmDelete.description")}
            okText={t("confirmDelete.ok")}
            cancelText={t("confirmDelete.cancel")}
            onConfirm={() => onDelete(table)}
          >
            <Tooltip title={t("action.delete")}>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                disabled={isDeleting}
                aria-label={t("action.delete")}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-admin-muted-soft hover:bg-admin-danger/10 hover:text-admin-danger"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}
