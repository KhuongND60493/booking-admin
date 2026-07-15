"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { App, Button, Tooltip } from "antd";
import { Ban, Check, Eye, UserCheck, UserX } from "lucide-react";
import type { TFunction } from "i18next";
import { BookingStatus, type Booking } from "@skybooking/api-client";
import { bookingErrorMessage } from "../utils/bookingErrorMessage";

export interface BookingRowActionsProps {
  booking: Booking;
  onConfirm: (id: number) => Promise<void>;
  onCheckIn: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  onNoShow: (id: number) => Promise<void>;
  canView: boolean;
  canEdit: boolean;
  canCancel: boolean;
  t: TFunction;
}

interface ConfirmDialogOptions {
  title: string;
  content: string;
  okText: string;
  danger?: boolean;
}

export function BookingRowActions({
  booking,
  onConfirm,
  onCheckIn,
  onCancel,
  onNoShow,
  canView,
  canEdit,
  canCancel,
  t,
}: BookingRowActionsProps) {
  const { message, modal } = App.useApp();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const isPending = pendingAction !== null;

  const runWithConfirm = (
    actionKey: string,
    dialog: ConfirmDialogOptions,
    action: () => Promise<void>,
    successMessage: string
  ) => {
    modal.confirm({
      title: dialog.title,
      content: dialog.content,
      okText: dialog.okText,
      cancelText: t("action.dismiss"),
      okButtonProps: dialog.danger ? { danger: true } : undefined,
      onOk: async () => {
        setPendingAction(actionKey);
        try {
          await action();
          message.success(successMessage);
        } catch (err) {
          message.error(t("toast.actionError", { error: bookingErrorMessage(err, t) }));
        } finally {
          setPendingAction(null);
        }
      },
    });
  };

  const handleConfirm = () =>
    runWithConfirm(
      "confirm",
      {
        title: t("action.confirmBookingTitle"),
        content: t("action.confirmBookingContent"),
        okText: t("action.confirm"),
      },
      () => onConfirm(booking.id),
      t("toast.confirmSuccess")
    );

  const handleCheckIn = () =>
    runWithConfirm(
      "checkIn",
      {
        title: t("action.checkInTitle"),
        content: t("action.checkInContent"),
        okText: t("action.confirm"),
      },
      () => onCheckIn(booking.id),
      t("toast.checkInSuccess")
    );

  const handleCancel = () =>
    runWithConfirm(
      "cancel",
      {
        title: t("action.confirmCancelTitle"),
        content: t("action.confirmCancelContent"),
        okText: t("action.confirmCancel"),
        danger: true,
      },
      () => onCancel(booking.id),
      t("toast.cancelSuccess")
    );

  const handleNoShow = () =>
    runWithConfirm(
      "noShow",
      {
        title: t("action.noShowTitle"),
        content: t("action.noShowContent"),
        okText: t("action.noShow"),
        danger: true,
      },
      () => onNoShow(booking.id),
      t("toast.noShowSuccess")
    );

  const renderIconButton = (
    key: string,
    icon: ReactNode,
    label: string,
    onClick: () => void,
    danger = false
  ) => (
    <Tooltip title={label} key={key}>
      <Button
        size="small"
        danger={danger}
        icon={icon}
        aria-label={label}
        loading={pendingAction === key}
        disabled={isPending}
        onClick={onClick}
      />
    </Tooltip>
  );

  const canCancelFromStatus =
    booking.status === BookingStatus.Pending ||
    booking.status === BookingStatus.Confirmed ||
    booking.status === BookingStatus.CheckedIn;
  const canNoShowFromStatus =
    booking.status === BookingStatus.Pending ||
    booking.status === BookingStatus.Confirmed ||
    booking.status === BookingStatus.CheckedIn;

  return (
    <div className="flex items-center justify-end gap-1.5">
      {(canView || canEdit) && (
        <Tooltip title={t("action.viewDetail")}>
          <Link href={`/bookings/${booking.id}`}>
            <Button size="small" icon={<Eye size={14} />} aria-label={t("action.viewDetail")} />
          </Link>
        </Tooltip>
      )}
      {booking.status === BookingStatus.Pending &&
        canEdit &&
        renderIconButton("confirm", <Check size={14} />, t("action.confirm"), handleConfirm)}
      {booking.status === BookingStatus.Confirmed &&
        canEdit &&
        renderIconButton("checkIn", <UserCheck size={14} />, t("action.checkIn"), handleCheckIn)}
      {canNoShowFromStatus &&
        canEdit &&
        renderIconButton("noShow", <UserX size={14} />, t("action.noShow"), handleNoShow, true)}
      {canCancelFromStatus &&
        canCancel &&
        renderIconButton("cancel", <Ban size={14} />, t("action.cancel"), handleCancel, true)}
    </div>
  );
}
